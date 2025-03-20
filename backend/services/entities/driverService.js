const {withOracleDB} = require("../../utils/oracleHelper");
const {tableExists} = require("../../utils/tableExists");

// DRIVER stuff

async function initiateDriverTables() {
    return await withOracleDB(async (connection) => {
        try {
            const driverTableExists = await tableExists("Driver");
            const driverInternalTableExists = await tableExists("Driver_Internal");

            if (driverTableExists && driverInternalTableExists) {
                console.log("Driver tables already exist. Skipping creation.");
                return false;
            }

            console.log("Driver-related tables not found. Creating tables...");

            if (!driverTableExists) {
                await connection.execute(`
                CREATE TABLE Driver (
                    name VARCHAR2(100) PRIMARY KEY,
                    driver_number NUMBER NOT NULL
                )
            `);
            }

            if(!driverInternalTableExists) {
                await connection.execute(`
                CREATE TABLE Driver_Internal (
                    driver_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    name VARCHAR2(100),
                    nationality VARCHAR2(50),
                    CONSTRAINT fk_name FOREIGN KEY (name)
                    REFERENCES Driver(name)
                    ON DELETE CASCADE
                )
            `);
            }
            console.log("Driver tables created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating tables:", error);
            return false;
        }
    });
}


async function insertDriver(name, nationality, driverNumber) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(
                `INSERT INTO Driver (name, driver_number) VALUES (:name, :number)`,
                [name, driverNumber],
            );

            const result = await connection.execute(
                `INSERT INTO Driver_Internal (name, nationality) VALUES (:name, :nationality)`,
                [name, nationality]
            );

            await connection.commit();

            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting driver info:", error);

            await connection.rollback();
            return false;
        }
    });
}

async function fetchDrivers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT di.name, di.nationality, d.driver_number
            FROM Driver_Internal di
            JOIN Driver d ON d.name = di.name
        `);
        return result.rows.map(row => ({
            name: row[0],
            nationality: row[1],
            driver_number: row[2]
        }));
    });
}

module.exports = {
    initiateDriverTables,
    insertDriver,
    fetchDrivers
}