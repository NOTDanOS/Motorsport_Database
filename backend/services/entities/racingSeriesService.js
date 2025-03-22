const {withOracleDB} = require("../../utils/oracleHelper");
const {tableExists} = require("../../utils/tableExists");

async function initiateRacingTables() {
    return await withOracleDB(async (connection) => {
        try {
            const racingExists = await tableExists('Racing');
            const racingSeriesExists = await tableExists('Racing_Series');

            if (racingExists && racingSeriesExists) {
                console.log("Racing series tables already exist. Skipping creation.");
                return false;
            }

            console.log("Creating the racing series tables...");

            if (!racingExists) {
                await connection.execute(`
                CREATE TABLE Racing (
                    rs_name VARCHAR2(100) PRIMARY KEY,
                    division VARCHAR2(50),
                    governing_body VARCHAR2(100)
                    )
                `);
            }

            if (!racingSeriesExists) {
                await connection.execute(`
                CREATE TABLE Racing_Series (
                    rs_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    rs_name VARCHAR2(100),
                    CONSTRAINT fk_racing_series_name FOREIGN KEY (rs_name)
                    REFERENCES Racing(rs_name)
                    ON DELETE SET NULL
                )
            `);
            }

            console.log("Racing series tables created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating racing series tables:", error);
            return false;
        }
    });
}


async function insertRacingSeries(rsName, division, governingBody) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(
                `INSERT INTO Racing (rs_name, division, governing_body) VALUES (:rs, :division, :governingBody)`,
                [rsName, division, governingBody],
                { autoCommit: true }
            );

            const result = await connection.execute(
                `INSERT INTO Racing_Series (rs_name) VALUES (:rs)`,
                [rsName],
                { autoCommit: true }
            );

            await connection.commit();

            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting racing series:", error);

            await connection.rollback();
            return false;
        }
    });
}

async function fetchRacingSeries() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT rs_name, division, governing_body FROM Racing`);
        return result.rows.map(row => ({
            rs_name: row[0],
            division: row[1],
            governing_body: row[2]
        }));
    });
}

module.exports = {
    initiateRacingTables,
    insertRacingSeries,
    fetchRacingSeries
}