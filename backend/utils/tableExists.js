const {withOracleDB} = require("../utils/oracleHelper");

async function tableExists(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT COUNT(*) FROM user_tables WHERE table_name = UPPER(:tableName)`,
            [tableName]
        );
        return result.rows[0][0] > 0;
    });
}

module.exports = {tableExists};
