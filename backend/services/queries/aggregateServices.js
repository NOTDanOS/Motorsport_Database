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

async function sponsorsWithAllTiers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT S.sponsor_name
            FROM Sponsor S
            WHERE NOT EXISTS (
                SELECT ST.tier_level
                FROM Sponsor_Tier ST
                MINUS
                SELECT S2.tier_level
                FROM Sponsor S2
                WHERE S2.sponsor_id = S.sponsor_id
            )
        `);
        return result.rows;
    });
}

module.exports = {
    engineersPerTeam,
    teamsWithMultipleEngineers,
    sponsorsWithAllTiers
};