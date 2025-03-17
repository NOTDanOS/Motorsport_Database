const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');


const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};


async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10);
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// SPONSORS GO HERE
// TODO: there should be preset sponsor tiers (bronze, silver..., diamond). Users shouldn't make new ones

async function initiateSponsorTables() {
    return await withOracleDB(async (connection) => {
        try {

            await connection.execute(`DROP TABLE Sponsor`);
            await connection.execute(`DROP TABLE Sponsor_Tier`);
        } catch(err) {
            console.log('Tables might not exist, proceeding to create...');
        }


        try {
            await connection.execute(`DROP SEQUENCE sponsor_seq`);
        } catch(err) {
            console.log('Sequence might not exist, proceeding to create...');
        }
        await connection.execute(`
            CREATE SEQUENCE sponsor_seq
            START WITH 1
            INCREMENT BY 1
            NOCACHE
            NOCYCLE
        `);

        await connection.execute(`
            CREATE TABLE Sponsor_Tier (
                tier_level VARCHAR2(50) PRIMARY KEY,
                amount_contributed NUMBER
            )
        `);

        await connection.execute(`
            CREATE TABLE Sponsor (
                sponsor_id NUMBER PRIMARY KEY,
                sponsor_name VARCHAR2(50),
                tier_level VARCHAR2(50),
                point_of_contact VARCHAR2(100),
                CONSTRAINT fk_sponsor_tier FOREIGN KEY (tier_level) REFERENCES Sponsor_Tier(tier_level)
                    ON DELETE SET NULL
            )
        `);

        // Handles auto increments for PK with just int
        await connection.execute(`
            CREATE OR REPLACE TRIGGER sponsor_id_trigger
            BEFORE INSERT ON Sponsor
            FOR EACH ROW
            BEGIN
                IF :new.sponsor_id IS NULL THEN
                    SELECT sponsor_seq.NEXTVAL INTO :new.sponsor_id FROM dual;
                END IF;
            END;
        `);

        return true;
    }).catch((err) => {
        console.error("Error creating sponsor tables:", err);
        return false;
    });
}

async function insertSponsorTier(tierLevel, amountContributed) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES (:tier, :amount)`,
            [tierLevel, amountContributed],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error("Error inserting sponsor tier:", error);
        return false;
    });
}

async function insertSponsor(sponsorName, tierLevel, pointOfContact) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact)
             VALUES (:name, :tier, :contact)`,
            [sponsorName, tierLevel, pointOfContact],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error("Error inserting sponsor:", error);
        return false;
    });
}

// TEAMS GO HERE

async function initiateTeamTables() {
    return await withOracleDB(async (connection) => {
        try {
            // Drop tables in reverse order of dependencies
            await connection.execute(`DROP TABLE Team`);
            await connection.execute(`DROP TABLE Team_Principal`);
        } catch(err) {
            console.log('Tables might not exist, proceeding to create...');
        }

        // Create sequences
        try {
            await connection.execute(`DROP SEQUENCE team_seq`);
        } catch(err) {
            console.log('Sequence might not exist, proceeding to create...');
        }
        await connection.execute(`
            CREATE SEQUENCE team_seq
            START WITH 1
            INCREMENT BY 1
            NOCACHE
            NOCYCLE
        `);

        // Create tables
        await connection.execute(`
            CREATE TABLE Team_Principal (
                team_principal VARCHAR2(100) PRIMARY KEY,
                team_name VARCHAR2(100) UNIQUE
            )
        `);

        await connection.execute(`
            CREATE TABLE Team (
                team_id NUMBER PRIMARY KEY,
                team_principal VARCHAR2(100),
                year_founded NUMBER,
                CONSTRAINT fk_team_principal FOREIGN KEY (team_principal) REFERENCES Team_Principal(team_principal)
                    ON DELETE SET NULL
            )
        `);

        // Create trigger
        await connection.execute(`
            CREATE OR REPLACE TRIGGER team_id_trigger
            BEFORE INSERT ON Team
            FOR EACH ROW
            BEGIN
                IF :new.team_id IS NULL THEN
                    SELECT team_seq.NEXTVAL INTO :new.team_id FROM dual;
                END IF;
            END;
        `);

        return true;
    }).catch((err) => {
        console.error("Error creating team tables:", err);
        return false;
    });
}

async function insertTeamPrincipal(principalName, teamName) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO Team_Principal (team_principal, team_name)
                 VALUES (:principal, :team)`,
                [principalName, teamName],
                { autoCommit: true }
            );

            return result.rowsAffected && result.rowsAffected > 0;
        } catch (error) {

            if (error.errorNum === 1 || (error.message && error.message.includes("unique constraint"))) {
                console.error(`Team name '${teamName}' already exists`);

                throw new Error(`Team name '${teamName}' already exists`);
            } else {

                console.error("Error inserting team principal:", error);
                throw error;
            }
        }
    }).catch((error) => {

        console.error(error.message || "Unknown error");
        return false;
    });
}

async function insertTeam(principalName, yearFounded) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Team (team_principal, year_founded)
             VALUES (:principal, :year)`,
            [principalName, yearFounded],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error("Error inserting team:", error);
        return false;
    });
}

async function insertTeamWithPrincipal(principalName, teamName, yearFounded) {

    const PrincipalAndTeamName = await insertTeamPrincipal(principalName, teamName);

    if (!PrincipalAndTeamName) {
        console.log("Failed to insert team principal");
        return false;
    }

    return await insertTeam(principalName, yearFounded);
}

module.exports = {
    testOracleConnection,
    initiateSponsorTables,
    initiateTeamTables,
    insertSponsorTier,
    insertSponsor,
    insertTeamWithPrincipal
};