const { withOracleDB } = require("../../utils/oracleHelper");
const { tableExists } = require("../../utils/tableExists");

async function initiateEngineerTables() {
  return await withOracleDB(async (connection) => {
    try {
      const engineerTableExists = await tableExists("Engineering_Team");
      const engineerAssignmentExists = await tableExists("Engineer_Assignment");

      if (engineerTableExists && engineerAssignmentExists) {
        console.log(
          "Engineer-related tables already exist. Skipping creation."
        );
        return false;
      }

      console.log("Engineering tables not found. Creating tables...");

      if (!engineerTableExists) {
        await connection.execute(`
                    CREATE TABLE Engineering_Team (
                                                      eng_team_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                                      team_name VARCHAR2(100),
                                                      department VARCHAR2(100),
                                                      HQ_address VARCHAR2(100)
                    )
                `);
      }

      if (!engineerAssignmentExists) {
        await connection.execute(`
                    CREATE TABLE Engineer_Assignment (
                                                         eng_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                                         name VARCHAR2(100),
                                                         proficiency VARCHAR2(50),
                                                         years_experience NUMBER,
                                                         eng_team_id NUMBER,
                                                         CONSTRAINT fk_eng_team_id FOREIGN KEY (eng_team_id)
                                                             REFERENCES Engineering_Team(eng_team_id)
                                                             ON DELETE SET NULL
                    )
                `);
      }

      console.log("Engineering-related tables created successfully.");
      return true;
    } catch (error) {
      console.error("Error checking/creating engineering tables:", error);
      return false;
    }
  });
}

async function insertEngineeringTeam(teamName, dept, HQ) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
        `INSERT INTO Engineering_Team (team_name, department, HQ_address) VALUES (:teamName, :dept, :HQ)`,
        [teamName, dept, HQ],
        { autoCommit: true }
      );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error("Error inserting a new engineering team:", error);
      return false;
    }
  });
}

async function insertEngineeringAssignment(
  name,
  proficiency,
  yearsExperience,
  engTeamId
) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
        `INSERT INTO Engineer_Assignment (name, proficiency, years_experience, eng_team_id)
                 VALUES (:name, :proficiency, :yearsExperience, :engTeamId)`,
        [name, proficiency, yearsExperience, engTeamId],
        { autoCommit: true }
      );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error("Error inserting a new engineer:", error);
      return false;
    }
  });
}

async function fetchEngineeringTeams() {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(`
                SELECT eng_team_id, team_name, department, HQ_address
                FROM Engineering_Team
            `);

      return result.rows.map((row) => ({
        eng_team_id: row[0],
        team_name: row[1],
        department: row[2],
        HQ_address: row[3],
      }));
    } catch (error) {
      console.error("Error fetching engineering teams:", error);
      throw error;
    }
  });
}

async function fetchEngineeringAssignment() {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(`
                SELECT ea.eng_id, ea.name, et.team_name, ea.proficiency, ea.years_experience
                FROM Engineer_Assignment ea
                JOIN Engineering_Team et ON ea.eng_team_id = et.eng_team_id
            `);

      return result.rows.map((row) => ({
        eng_id: row[0], 
        name: row[1],
        team_name: row[2],
        proficiency: row[3],
        years_experience: row[4],
      }));
    } catch (error) {
      console.error("Error fetching engineering assignments:", error);
      throw error;
    }
  });
}

async function updateEngineeringAssignment({
  oldName,
  newName,
  newProficiency,
  newYearsExperience,
  newTeamId,
}) {
  return await withOracleDB(async (connection) => {
    try {
      const updates = [];
      const params = { oldName };

      if (newName) {
        updates.push(`name = :newName`);
        params.newName = newName;
      }

      if (newProficiency) {
        updates.push(`proficiency = :newProficiency`);
        params.newProficiency = newProficiency;
      }

      if (newYearsExperience !== undefined) {
        updates.push(`years_experience = :newYearsExperience`);
        params.newYearsExperience = newYearsExperience;
      }

      if (newTeamId !== undefined) {
        updates.push(`eng_team_id = :newTeamId`);
        params.newTeamId = newTeamId;
      }

      if (updates.length === 0) {
        console.log("No fields to update for engineering assignment.");
        return false;
      }

      const query = `
                UPDATE Engineer_Assignment
                SET ${updates.join(", ")}
                WHERE name = :oldName
            `;

      const result = await connection.execute(query, params, {
        autoCommit: true,
      });
      return result.rowsAffected && result.rowsAffected > 0;
    } catch (error) {
      console.error("Error updating engineering assignment:", error);
      return false;
    }
  });
}

async function updateEngineeringTeam({
  oldTeamName,
  newTeamName,
  newDept,
  newHQ,
}) {
  return await withOracleDB(async (connection) => {
    try {
      const updates = [];
      const params = { oldTeamName };

      if (newTeamName) {
        updates.push(`team_name = :newTeamName`);
        params.newTeamName = newTeamName;
      }

      if (newDept) {
        updates.push(`department = :newDept`);
        params.newDept = newDept;
      }

      if (newHQ) {
        updates.push(`HQ_address = :newHQ`);
        params.newHQ = newHQ;
      }

      if (updates.length === 0) {
        console.log("No fields to update for engineering teams.");
        return false;
      }

      const query = `
                UPDATE Engineering_Team
                SET ${updates.join(", ")}
                WHERE team_name = :oldTeamName
            `;

      const result = await connection.execute(query, params, {
        autoCommit: true,
      });
      return result.rowsAffected && result.rowsAffected > 0;
    } catch (error) {
      console.error("Error updating engineering teams:", error);
      return false;
    }
  });
}

async function deleteRows(tableName, conditions = {}, partial = false) {
  return await withOracleDB(async (connection) => {
    if (!tableName || Object.keys(conditions).length === 0) {
      console.log("Table name and conditions are required");
      return false;
    }

    const allowedTables = ["Engineer_Assignment", "Engineering_Team"];
    if (!allowedTables.includes(tableName)) {
      console.log("Table not allowed");
      return false;
    }

    const whereClauses = [];
    const bindParams = {};
    let index = 0;

    for (const [column, value] of Object.entries(conditions)) {
      const bindKey = `val${index}`;
      whereClauses.push(
        partial ? `${column} LIKE :${bindKey}` : `${column} = :${bindKey}`
      );
      bindParams[bindKey] = partial ? `%${value}%` : value;
      index++;
    }

    const sql = `DELETE FROM ${tableName} WHERE ${whereClauses.join(" AND ")}`;

    try {
      const result = await connection.execute(sql, bindParams, {
        autoCommit: true,
      });
      console.log(`Deleted ${result.rowsAffected} rows from ${tableName}`);
      return result.rowsAffected;
    } catch (error) {
      console.error(`Error deleting rows from ${tableName}:`, error);
      return false;
    }
  });
}

module.exports = {
  initiateEngineerTables,
  insertEngineeringTeam,
  insertEngineeringAssignment,
  fetchEngineeringTeams,
  fetchEngineeringAssignment,
  updateEngineeringAssignment,
  updateEngineeringTeam,
  deleteRows,
};
