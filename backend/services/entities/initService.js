const { initiateEngineerTables } = require('./engineerService');
const { initiateSponsorTables } = require('./sponsorService');
const { initiateTeamTables } = require('./teamService');
const { initiateDriverTables } = require('./driverService');
const { initiateRacingTables } = require('./racingSeriesService');
const { initiateVehicleTables } = require('./vehicleService');
/*const { initiateFundsTable } = require('../relationships/fundsService');*/

async function initializeAllTables() {
    try {
        console.log("Starting initialization of all database tables...");
        

        const engineerTablesResult = await initiateEngineerTables();
        const sponsorTablesResult = await initiateSponsorTables();
        const teamTablesResult = await initiateTeamTables();
        const driverTablesResult = await initiateDriverTables();
        const racingSeriesTablesResult = await initiateRacingTables();
        const vehicleTablesResult = await initiateVehicleTables();
        

        /*const fundsTableResult = await initiateFundsTable();*/
        
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