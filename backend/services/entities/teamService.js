const {withOracleDB} = require("../../utils/oracleHelper");
const tableExists = require("../../utils/tableExists");

async function initiateTeamTables() {
    return await withOracleDB(async (connection) => {
        try {
            const teamTableExists = await tableExists("TEAM");
            const teamPrincipalTableExists = await tableExists("TEAM_PRINCIPAL");

            if (teamTableExists && teamPrincipalTableExists) {
                console.log("Team tables already exist. Skipping creation.");
                return false;
            }

            console.log("Creating the team tables...");

            if (!teamPrincipalTableExists) {
                await connection.execute(`
                    CREATE TABLE Team_Principal (
                        team_principal VARCHAR2(100) PRIMARY KEY,
                        team_name VARCHAR(100) UNIQUE)
                `);
            }

            if (!teamTableExists) {
                await connection.execute(`
                    CREATE TABLE Team(
                        team_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        team_principal VARCHAR2(100),
                        year_founded   NUMBER(4) CHECK (year_founded BETWEEN 1000 AND 9999),
                        CONSTRAINT fk_team_principal FOREIGN KEY (team_principal)
                            REFERENCES Team_Principal (team_principal)
                            ON DELETE SET NULL)
                            `);
            }

            console.log("Team tables created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating team tables:", error);
            return false;
        }
    });
}

async function insertTeamWithPrincipal(principalName, teamName, yearFounded) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(
                `INSERT INTO Team_Principal (team_principal, team_name) VALUES (:principal, :team)`,
                [principalName, teamName],
                { autoCommit: true }

            );

            const result = await connection.execute(
                `INSERT INTO Team (team_principal, year_founded) VALUES (:principal, :year)`,
                [principalName, yearFounded],
                { autoCommit: true }
            );

            await connection.commit();
            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting team and principal:", error);
            await connection.rollback();
            return false;
        }
    });
}

async function fetchTeams() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`
                SELECT team_name, team_principal, year_founded FROM Team 
                JOIN Team_Principal ON Team.team_principal = Team_Principal.team_principal
            `);
            return result.rows.map(row => ({
                team_name: row[0],
                team_principal: row[1],
                year_founded: row[2]
            }));
        } catch (error) {
            console.error("Error fetching teams:", error);
            return [];
        }
    });
}

module.exports = {
    initiateTeamTables,
    insertTeamWithPrincipal,
    fetchTeams
};
