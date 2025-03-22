const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const {withOracleDB} = require("./utils/oracleHelper");

const envVariables = loadEnvFile('./.env');

const sponsorService = require('./services/entities/sponsorService');
const teamService = require("./services/entities/teamService");
const racingSeriesService = require("./services/entities/racingSeriesService");
const driverService = require("./services/entities/driverService");
const vehicleService = require("./services/entities/vehicleService");
const engineerService = require("./services/entities/engineerService");

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

async function testOracleConnection() {
    return await withOracleDB(async () => true).catch(() => false);
}



module.exports = {
    testOracleConnection,
    initiateSponsorTables: sponsorService.initiateSponsorTables,
    insertSponsorTier: sponsorService.insertSponsorTier,
    insertSponsor: sponsorService.insertSponsor,
    fetchSponsorTiers: sponsorService.fetchSponsorTiers,
    fetchSponsors: sponsorService.fetchSponsors,

    initiateTeamTables: teamService.initiateTeamTables,
    insertTeamWithPrincipal: teamService.insertTeamWithPrincipal,
    fetchTeams: teamService.fetchTeams,

    initiateRacingTables: racingSeriesService.initiateRacingTables,
    insertRacingSeries: racingSeriesService.insertRacingSeries,
    fetchRacingSeries: racingSeriesService.fetchRacingSeries,

    initiateDriverTables: driverService.initiateDriverTables,
    insertDrivers: driverService.insertDriver,
    fetchDrivers: driverService.fetchDrivers,

    initiateVehicleTables: vehicleService.initiateVehicleTables,
    insertVehicles: vehicleService.insertVehicle,
    fetchVehicles: vehicleService.fetchVehicles,

    initiateEngineerTables: engineerService.initiateEngineerTables,
    insertEngineeringTeam: engineerService.insertEngineeringTeam,
    insertEngineeringAssignment: engineerService.insertEngineeringAssignment,
    fetchEngineeringAssignment: engineerService.fetchEngineeringAssignment,
    fetchEngineeringTeams: engineerService.fetchEngineeringTeams

    // TODO: finish the rest
};