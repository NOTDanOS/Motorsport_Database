const { withOracleDB } = require("../../utils/oracleHelper");

async function vehicleCountByTeam() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT T.team_name, COUNT(V.vehicle_id) AS num_vehicles
            FROM Team T
            JOIN Vehicle V on T.team_id = V.team_id
            GROUP BY T.team_name
            `);
        return result.rows;
    });
}

async function teamsWithMultipleVehicles() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT T.team_name, COUNT(V.vehicle_id) AS num_vehicles
            FROM Team T
            JOIN Vehicle V on T.team_id = V.team_id
            GROUP BY T.team_name
            HAVING COUNT(V.vehicle_id) > 1
            `);
        return result.rows;
    });
}

async function sponsorsFundingAllTeams() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT S.sponsor_name
            FROM Sponsor s
            WHERE NOT EXISTS (
                SELECT T.team_id
                FROM Team T
                MINUS
                SELECT F.team_id
                FROM Funds F
                WHERE F.sponsor_id = S.sponsor_id
            )
        `);
        return result.rows;
    });
}

module.exports = {
    vehicleCountByTeam,
    teamsWithMultipleVehicles,
    sponsorsFundingAllTeams
};