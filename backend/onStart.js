const {initiateSponsorTables, initiateTeamTables} = require("./appService");

async function initializeAllTables() {
    console.log("Checking if tables exist...");

    try {
        await initiateSponsorTables();
        await initiateTeamTables();
        console.log("Table initialization completed.");
    } catch (error) {
        console.error("Error initializing tables:", error);
    }
}

module.exports = initializeAllTables;