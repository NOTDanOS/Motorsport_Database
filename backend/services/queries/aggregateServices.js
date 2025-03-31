const { withOracleDB } = require("../../utils/oracleHelper");

async function engineersPerTeam() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
            SELECT ET.team_name, COUNT(EA.eng_id) AS num_engineers
            FROM Engineering_Team ET
            JOIN Engineer_Assignment EA ON ET.eng_team_id = EA.eng_team_id
            GROUP BY ET.team_name
            `);
    return result.rows;
  });
}

async function teamsWithMultipleEngineers() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
            SELECT ET.team_name, COUNT(EA.eng_id) AS num_engineers
            FROM Engineering_Team ET
            JOIN Engineer_Assignment EA ON ET.eng_team_id = EA.eng_team_id
            GROUP BY ET.team_name
            HAVING COUNT(EA.eng_id) > 1
            `);
    return result.rows;
  });
}

async function experiencedEngineeringTeams() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
            SELECT eng_team_id, AVG(years_experience) AS avg_experience
            FROM Engineer_Assignment
            GROUP BY eng_team_id
            HAVING AVG(years_experience) > (SELECT AVG(years_experience) FROM Engineer_Assignment)
            `);
    return result.rows;
  });
}

async function teamsInAllRacingSeries() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`
            SELECT T.team_id
            FROM Team T
            WHERE NOT EXISTS (SELECT RS.rs_id
                              FROM Racing_Series RS
                              EXCEPT
                              SELECT CI.racing_series_id
                              FROM Competes_In CI
                              WHERE CI.team_id = T.team_id)
            `);
    return result.rows;
  });
}

module.exports = {
  engineersPerTeam,
  teamsWithMultipleEngineers,
  experiencedEngineeringTeams,
  teamsInAllRacingSeries,
};
