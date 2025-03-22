const { initiateEngineerTables } = require('./entities/engineerService');
const { initiateSponsorTables } = require('./entities/sponsorService');
const { initiateTeamTables } = require('./entities/teamService');
const { initiateDriverTables } = require('./entities/driverService');
const { initiateRacingSeriesTables } = require('./entities/racingSeriesService');
const { initiateVehicleTables } = require('./entities/vehicleService');
const { initiateFundsTable } = require('./relations/fundsService');

async function initializeAllTables() {
    try {
        console.log("Starting initialization of all database tables...");
        

        const engineerTablesResult = await initiateEngineerTables();
        const sponsorTablesResult = await initiateSponsorTables();
        const teamTablesResult = await initiateTeamTables();
        const driverTablesResult = await initiateDriverTables();
        const racingSeriesTablesResult = await initiateRacingSeriesTables();
        const vehicleTablesResult = await initiateVehicleTables();
        

        const fundsTableResult = await initiateFundsTable();
        
        console.log("All tables initialization complete.");
        
        return {
            success: true,
            results: {
                engineers: engineerTablesResult,
                sponsors: sponsorTablesResult,
                teams: teamTablesResult,
                drivers: driverTablesResult,
                racingSeries: racingSeriesTablesResult,
                vehicles: vehicleTablesResult,
                funds: fundsTableResult
            }
        };
    } catch (error) {
        console.error("Error initializing all tables:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    initializeAllTables
};