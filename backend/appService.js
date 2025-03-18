const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

/// Database configuration setup. Ensure your .env file has the required database credentials.
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
        console.error('Initialization error:', err.message);
    }
}

async function closePoolAndExit() {
    console.log('\n⏳ Closing connection pool...');
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
        connection = await oracledb.getConnection();
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

async function testOracleConnection() {
    return await withOracleDB(async () => true).catch(() => false);
}

// SPONSOR Stuff

async function initiateSponsorTables() {
    return await withOracleDB(async (connection) => {
        try {
            const checkResult = await connection.execute(`
                SELECT table_name FROM user_tables WHERE table_name = 'SPONSOR_TIER'
            `);

            if (checkResult.rows.length > 0) {
                console.log("Sponsor tables already exist. Skipping creation.");
                return false; // Tables already exist
            }

            console.log("Sponsor tables not found. Creating tables...");

            await connection.execute(`
                CREATE TABLE Sponsor_Tier (
                    tier_level VARCHAR2(50) PRIMARY KEY,
                    amount_contributed NUMBER CHECK (amount_contributed >= 0)
                )
            `);

            await connection.execute(`
                CREATE TABLE Sponsor (
                    sponsor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    sponsor_name VARCHAR2(50) NOT NULL UNIQUE,
                    tier_level VARCHAR2(50),
                    point_of_contact VARCHAR2(100),
                    CONSTRAINT fk_sponsor_tier FOREIGN KEY (tier_level) 
                        REFERENCES Sponsor_Tier(tier_level) 
                        ON DELETE SET NULL
                )
            `);

            console.log("Sponsor tables created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating sponsor tables:", error);
            return false;
        }
    });
}


async function insertSponsorTier(tierLevel, amountContributed) {
    return await withOracleDB(async (connection) => {
        try {
        const result = await connection.execute(
            `INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES (:tier, :amount)`,
            [tierLevel, amountContributed],
            { autoCommit: true }
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

async function insertSponsor(sponsorName, tierLevel, pointOfContact) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact) 
                 VALUES (:name, :tier, :contact)`,
                [sponsorName, tierLevel, pointOfContact]
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

async function fetchSponsorTiers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT tier_level, amount_contributed FROM Sponsor_Tier`);
        return result.rows.map(row => ({
            tier_level: row[0],
            amount_contributed: row[1]
        }));
    });
}

async function fetchSponsors() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT sponsor_name, tier_level, point_of_contact FROM Sponsor`);
        return result.rows.map(row => ({
            sponsor_name: row[0],
            tier_level: row[1],
            point_of_contact: row[2]
        }));
    });
}


// TEAM Stuff

async function initiateTeamTables() {
    return await withOracleDB(async (connection) => {
        try {
            // Check if the Team_Principal table exists
            const checkResult = await connection.execute(`
                SELECT table_name FROM user_tables WHERE table_name = 'TEAM_PRINCIPAL'
            `);

            if (checkResult.rows.length > 0) {
                console.log("Team tables already exist. Skipping creation.");
                return false; // Tables already exist
            }

            console.log("Team tables not found. Creating tables...");

            await connection.execute(`
                CREATE TABLE Team_Principal (
                    team_principal VARCHAR2(100) PRIMARY KEY,
                    team_name VARCHAR(100) UNIQUE
                )
            `);

            await connection.execute(`
                CREATE TABLE Team (
                    team_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    team_principal VARCHAR2(100) NOT NULL,
                    year_founded NUMBER (4) CHECK (year_founded BETWEEN 1000 AND 9999) NOT NULL,
                    CONSTRAINT fk_team_principal FOREIGN KEY (team_principal) 
                        REFERENCES Team_Principal(team_principal) 
                        ON DELETE SET NULL
                )
            `);

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
                [principalName, teamName]
            );

            const result = await connection.execute(
                `INSERT INTO Team (team_principal, year_founded) VALUES (:principal, :year)`,
                [principalName, yearFounded]
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
        const result = await connection.execute(`SELECT team_name, team_principal, year_founded FROM Team`);
        return result.rows.map(row => ({
            team_name: row[0],
            team_principal: row[1],
            year_founded: row[2]
        }));
    });
}


module.exports = {
    testOracleConnection,
    initiateSponsorTables,
    insertSponsorTier,
    insertSponsor,
    fetchSponsorTiers,
    fetchSponsors,
    initiateTeamTables,
    insertTeamWithPrincipal,
    fetchTeams
};