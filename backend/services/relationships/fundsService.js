/*
const {withOracleDB} = require("../../utils/oracleHelper");
const {tableExists} = require("../../utils/tableExists");


async function initiateFundsTable() {
    return await withOracleDB(async (connection) => {
        try {
            const fundsExists = await tableExists('funds');

            if (fundsExists) {
                console.log("Fund table already exist. Skipping creation.");
                return false;
            }

            console.log("Creating the fund table...");


            await connection.execute(`
                CREATE TABLE Funds (
                    sponsor_id NUMBER PRIMARY KEY,
                    team_id NUMBER PRIMARY KEY,
                    contract_start_date DATE,
                    contract_end_date DATE,
                    CONSTRAINT fk_sponsor_id FOREIGN KEY (sponsor_id) 
                        REFERENCES Sponsor(sponsor_id) 
                        ON DELETE CASCADE FOREIGN KEY (sponsor_id),
                    CONSTRAINT fk_team_id FOREIGN KEY (team_id)
                        REFERENCES Team(team_id)
                        ON DELETE CASCADE FOREIGN KEY (team_id)
                )
            `);

            console.log("Fund table created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating fund table:", error);
            return false;
        }
    });
}

async function insertFunds(sponsorID, teamID, contractStart, contractEnd) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO Funds (sponsor_id, teamID, contractStart, contractEnd) 
                 VALUES (:sponsor, :team, :start, :end)`,
                [sponsorID, teamID, contractStart, contractEnd]
            );

            await connection.commit();

            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting sponsor:", error);

            await connection.rollback();
            return false;
        }
    });
}

async function fetchFunds() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT s.sponsor_name, t.team_name, f.contract_start_date, f.contract_end_date
            FROM Funds f
            JOIN Sponsor s ON f.sponsor_id = s.sponsor_id
            JOIN Team t ON f.team_id = t.team_id`);
        return result.rows.map(row => ({
            sponsor_name: row[0],
            team_name: row[1],
            contract_start_date: row[2],
            contract_end_date: row[3]
        }));
    });
}

module.exports = {
    initiateFundsTable,
    insertFunds,
    fetchFunds
};*/
