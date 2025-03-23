const {withOracleDB} = require("../../utils/oracleHelper");
const {tableExists} = require("../../utils/tableExists");

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
                    driver_name VARCHAR2(100) PRIMARY KEY,
                    driver_number NUMBER NOT NULL
                )
            `);
            }

            if(!driverInternalTableExists) {
                await connection.execute(`
                CREATE TABLE Driver_Internal (
                    driver_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    driver_name VARCHAR2(100),
                    country_of_origin VARCHAR2(50),
                    CONSTRAINT fk_name FOREIGN KEY (driver_name)
                    REFERENCES Driver(driver_name)
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


async function insertDriver(name, country, driver_number) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(
                `INSERT INTO Driver (driver_name, driver_number) VALUES (:name, :driver_number)`,
                { name, driver_number }
            );

            const result = await connection.execute(
                `INSERT INTO Driver_Internal (driver_name, country_of_origin) VALUES (:name, :country)`,
                { name, country }
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
            SELECT di.driver_name, di.country_of_origin, d.driver_number
            FROM Driver_Internal di
            JOIN Driver d ON d.driver_name = di.driver_name
        `);
        return result.rows.map(row => ({
            driver_name: row[0],
            country_of_origin: row[1],
            driver_number: row[2]
        }));
    });
}

module.exports = {
    initiateDriverTables,
    insertDriver,
    fetchDrivers
}