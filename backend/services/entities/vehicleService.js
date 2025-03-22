const {withOracleDB} = require("../../utils/oracleHelper");
const {tableExists} = require("../../utils/tableExists");

// VEHICLE stuff

async function initiateVehicleTables() {
    return await withOracleDB(async (connection) => {
        try {
            const teamTableExists = await tableExists("Team");
            const driverTableExists = await tableExists("Driver");
            const vehicleTableExists = await tableExists("Vehicle");
            const carTableExists = await tableExists("Car");
            const motorcycleTableExists = await tableExists("Motorcycle");

            if (!teamTableExists || !driverTableExists) {
                console.error("Team and/or Driver table does not exist. Cannot create Vehicle table.");
                return false;
            }

            if (vehicleTableExists && carTableExists && motorcycleTableExists) {
                console.log("Vehicle table already exist. Skipping creation.");
                return false;
            }

            console.log("Vehicle tables not found. Creating tables...");

            if (!vehicleTableExists) {
                await connection.execute(`
                CREATE TABLE Vehicle (
                    vehicle_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    model VARCHAR2(100),
                    year_first_produced NUMBER (4) CHECK (year_first_produced BETWEEN 1000 AND 2015),
                    team_id NUMBER,
                    driver_id NUMBER,
                    CONSTRAINT fk_team FOREIGN KEY (team_id) 
                        REFERENCES Team(team_id) 
                        ON DELETE SET NULL,
                    CONSTRAINT fk_driver FOREIGN KEY (driver_id)
                        REFERENCES Driver_Internal(driver_id)
                        ON DELETE SET NULL
                )
            `);
            }

            if (!carTableExists) {
                await connection.execute(`
                CREATE TABLE Car (
                    vehicle_id NUMBER PRIMARY KEY,
                    drivetrain CHAR(3) CHECK (drivetrain IN ('FWD', 'RWD', '4WD', 'AWD')),
                    car_type VARCHAR2(50),
                    CONSTRAINT fk_car_vehicle FOREIGN KEY (vehicle_id)
                        REFERENCES Vehicle(vehicle_id)
                        ON DELETE SET NULL
                )
            `);
            }

            if (!motorcycleTableExists) {
                await connection.execute(`
                CREATE TABLE Motorcycle (
                    vehicle_id NUMBER PRIMARY KEY,
                    engine_cc NUMBER CHECK (engine_cc BETWEEN 100 AND 3000),
                    motorcycle_type VARCHAR2(50),
                    CONSTRAINT fk_motorcycle_vehicle FOREIGN KEY (vehicle_id)
                        REFERENCES Vehicle(vehicle_id)
                        ON DELETE SET NULL
                )
            `);
            }

            console.log("Vehicle, car, and motorcycle tables created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating tables:", error);
            return false;
        }
    });
}


async function insertVehicle(model, yearFirstProduced, teamId, driverId, vehicleType, drivetrain = null,
                             carType = null, engineCc = null, motorcycleType = null) {
    return await withOracleDB(async (connection) => {
        try {
            // Insert into Vehicle table
            const vehicleResult = await connection.execute(
                `INSERT INTO Vehicle (model, year_first_produced, team_id, driver_id)
                 VALUES (:model, :yearFirstProduced, :teamId, :driverId)
                     RETURNING vehicle_id INTO :vehicleId`,
                {
                    model,
                    yearFirstProduced,
                    teamId,
                    driverId,
                    vehicleId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                }
            );

            const vehicleId = vehicleResult.outBinds.vehicleId[0];

            if (!type) {
                await connection.commit();
                return true;
            }

            // Insert into the appropriate subclass (Car or Motorcycle)
            if (vehicleType === "Car") {
                await connection.execute(
                    `INSERT INTO Car (vehicle_id, drivetrain, car_type)
                     VALUES (:vehicleId, :drivetrain, :carType)`,
                    { vehicleId, drivetrain, carType }
                );
            } else if (vehicleType === "Motorcycle") {
                await connection.execute(
                    `INSERT INTO Motorcycle (vehicle_id, engine_cc, motorcycle_type)
                     VALUES (:vehicleId, :engineCc, :motorcycleType)`,
                    { vehicleId, engineCc, motorcycleType }
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            console.error("Error inserting vehicle:", error);
            await connection.rollback();
            return false;
        }
    });
}

async function fetchVehicles() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT
                V.vehicle_id,
                V.model,
                V.year_first_produced,
                T.team_name,
                D.name AS driver_name,
                CASE
                    WHEN C.vehicle_id IS NOT NULL THEN 'Car'
                    WHEN M.vehicle_id IS NOT NULL THEN 'Motorcycle'
                    ELSE 'Unknown'
                    END AS vehicle_type,
                C.drivetrain,
                C.car_type,
                M.engine_cc,
                M.motorcycle_type
            FROM Vehicle V
                     LEFT JOIN Team T ON V.team_id = T.team_id
                     LEFT JOIN Driver D ON V.driver_id = D.driver_id
                     LEFT JOIN Car C ON V.vehicle_id = C.vehicle_id
                     LEFT JOIN Motorcycle M ON V.vehicle_id = M.vehicle_id
        `);

        return result.rows.map(row => ({
            vehicle_id: row[0],
            model: row[1],
            year_first_produced: row[2],
            team_name: row[3],
            driver_name: row[4] || "No Driver",
            vehicle_type: row[5],
            drivetrain: row[6] || null,
            car_type: row[7] || null,
            engine_cc: row[8] || null,
            motorcycle_type: row[9] || null
        }));
    });
}


module.exports = {
    initiateVehicleTables,
    insertVehicle,
    fetchVehicles
}