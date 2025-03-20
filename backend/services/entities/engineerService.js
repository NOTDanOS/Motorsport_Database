const {withOracleDB} = require("../../utils/oracleHelper");
const {tableExists} = require("../../utils/tableExists");

async function initiateEngineerTables() {
    return await withOracleDB(async (connection) => {
        try {
            const engineerTableExists = await tableExists("Engineering_Team");
            const engineerAssignmentExists = await tableExists("Engineer_Assignment");

            if (engineerTableExists && engineerAssignmentExists) {
                console.log("Engineer-related tables already exist. Skipping creation.");
                return false;
            }

            console.log("Engineering tables not found. Creating tables...");

            if (!engineerTableExists) {
                await connection.execute(`
                CREATE TABLE Engineering_Team (
                    eng_team_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    team_name VARCHAR2(100),
                    department VARCHAR2(100),
                    HQ_address VARCHAR2(100)
                )
            `);
            }

            if (!engineerAssignmentExists) {
                await connection.execute(`
                CREATE TABLE Engineer_Assignment (
                    eng_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    name VARCHAR2(100),
                    proficiency VARCHAR2(50),
                    years_experience NUMBER,
                    eng_team_id NUMBER,
                    CONSTRAINT fk_eng_team_id FOREIGN KEY (eng_team_id)
                        REFERENCES Engineering_Team(eng_team_id)
                        ON DELETE SET NULL
                )
            `);
            }

            console.log("Engineering-related tables created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating engineering tables:", error);
            return false;
        }
    });
}


async function insertEngineeringTeam(teamName, dept, HQ) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO Engineering_Team (team_name, department, HQ_address) 
VALUES (:teamName, :dept, :HQ)`,
                [teamName, dept, HQ],
                { autoCommit: true }
            );

            await connection.commit();

            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting a new engineering team:", error);

            await connection.rollback();
            return false;
        }
    });
}

async function insertEngineeringAssignment(name, proficiency, years_experience, eng_team_id) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id) 
VALUES (:name, :proficiency, :years_experience, :eng_team_id)`,
                [name, proficiency, years_experience, eng_team_id],
                { autoCommit: true }
            );

            await connection.commit();

            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting a new engineer:", error);

            await connection.rollback();
            return false;
        }
    });
}

async function fetchEngineeringTeams() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT team_name, department, HQ_address
            FROM Engineering_Team
        `);

        return result.rows.map(row => ({
            team_name: row[0],
            department: row[1],
            HQ_address: row[2]
        }));
    });
}

async function fetchEngineeringAssignment() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT ea.name, et.team_name, ea.proficiency, ea.years_experience
            FROM Engineer_Assignment ea
            JOIN Engineering_Team et ON ea.eng_team_id = et.eng_team_id

        `);

        return result.rows.map(row => ({
            team_name: row[0],
            department: row[1],
            HQ_address: row[2]
        }));
    });
}


module.exports = {
    initiateEngineerTables,
    insertEngineeringTeam,
    insertEngineeringAssignment,
    fetchEngineeringTeams,
    fetchEngineeringAssignment
}