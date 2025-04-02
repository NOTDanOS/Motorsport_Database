const { withOracleDB } = require("./utils/oracleHelper");

const sponsorService = require("./services/entities/sponsorService");
const teamService = require("./services/entities/teamService");
const racingSeriesService = require("./services/entities/racingSeriesService");
const driverService = require("./services/entities/driverService");
const vehicleService = require("./services/entities/vehicleService");
const engineerService = require("./services/entities/engineerService");

const aggregateServices = require("./services/queries/aggregateServices");

async function testOracleConnection() {
  return await withOracleDB(async (connection) => {
    return true;
  })
    .catch(() => {})
    .catch(() => {
      return false;
    });
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
  insertDriver: driverService.insertDriver,
  fetchDrivers: driverService.fetchDrivers,

  initiateVehicleTables: vehicleService.initiateVehicleTables,
  insertVehicle: vehicleService.insertVehicle,
  fetchVehicles: vehicleService.fetchVehicles,

  initiateEngineerTables: engineerService.initiateEngineerTables,
  insertEngineeringTeam: engineerService.insertEngineeringTeam,
  insertEngineeringAssignment: engineerService.insertEngineeringAssignment,
  fetchEngineeringAssignment: engineerService.fetchEngineeringAssignment,
  fetchEngineeringTeams: engineerService.fetchEngineeringTeams,

  engineersPerTeam: aggregateServices.engineersPerTeam,
  teamsWithMultipleEngineers: aggregateServices.teamsWithMultipleEngineers,
  experiencedEngineeringTeams: aggregateServices.experiencedEngineeringTeams,
  teamsInAllRacingSeries: aggregateServices.teamsInAllRacingSeries,
};
