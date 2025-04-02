const { withOracleDB } = require("../../utils/oracleHelper");
const { tableExists } = require("../../utils/tableExists");

async function insertSponsorTiersIfNotExists() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
        `SELECT COUNT(*) FROM Sponsor_Tier`
    );

    if (result.rows[0][0] === 0) {
      console.log("Inserting preset sponsor tiers...");
      await connection.executeMany(
          `INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES (:tier, :amount)`,
          [
            { tier: "Bronze", amount: 100000 },
            { tier: "Silver", amount: 500000 },
            { tier: "Gold", amount: 1000000 },
            { tier: "Platinum", amount: 5000000 },
            { tier: "Diamond", amount: 10000000 },
          ],
          { autoCommit: true }
      );
    } else {
      console.log("Sponsor tiers already exist. Skipping insert.");
    }
  });
}

async function initiateSponsorTables() {
  return await withOracleDB(async (connection) => {
    try {
      const sponsorTierExists = await tableExists("Sponsor_Tier");
      const sponsorExists = await tableExists("Sponsor");
      const fundsExists = await tableExists("funds");

      if (sponsorTierExists && sponsorExists && fundsExists) {
        console.log("Sponsor tables already exist. Skipping creation.");
        return false;
      }

      console.log("Creating sponsor tables...");

      if (!sponsorTierExists) {
        await connection.execute(`
          CREATE TABLE Sponsor_Tier (
              tier_level VARCHAR2(50),
              amount_contributed NUMBER CHECK (amount_contributed >= 0),
              CONSTRAINT sponsor_tier_pk PRIMARY KEY (tier_level),
              CONSTRAINT unique_amount_contributed UNIQUE (amount_contributed)
          )
        `);
      }

      await insertSponsorTiersIfNotExists();

      if (!sponsorExists) {
        await connection.execute(`
          CREATE TABLE Sponsor(
                                sponsor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                sponsor_name VARCHAR2(50) NOT NULL,
                                tier_level VARCHAR2(50),
                                point_of_contact VARCHAR2(100),
                                CONSTRAINT unique_sponsor_name UNIQUE (sponsor_name),
                                CONSTRAINT fk_sponsor_tier FOREIGN KEY (tier_level)
                                  REFERENCES Sponsor_Tier(tier_level)
                                  ON DELETE SET NULL
          )
        `);
      }

      console.log("Sponsor tables created successfully.");
      return true;
    } catch (error) {
      console.error("Error checking/creating sponsor tables:", error);
      throw error;
    }
  });
}

async function insertSponsorTier(tierLevel, amountContributed) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES (:tier, :amount)`,
          [tierLevel, amountContributed],
          { autoCommit: true }
      );

      return { success: result.rowsAffected > 0 };
    } catch (error) {
      if (error.message.includes("ORA-00001")) {
        if (error.message.includes("SPONSOR_TIER_PK")) {
          return {
            success: false,
            message: "Tier level already exists. Try a different name."
          };
        } else if (error.message.includes("UNIQUE_AMOUNT_CONTRIBUTED")) {
          return {
            success: false,
            message: "Another tier already has this contribution amount. Choose a unique value."
          };
        } else {
          return {
            success: false,
            message: "A duplicate value was detected. Please check your data."
          };
        }
      }

      console.error("Error inserting sponsor tier:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  });
}

async function insertSponsor(sponsorName, tierLevel, pointOfContact) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `INSERT INTO Sponsor (sponsor_name, tier_level, point_of_contact)
           VALUES (:name, :tier, :contact)`,
          [sponsorName, tierLevel, pointOfContact],
          { autoCommit: true }
      );

      return { success: result.rowsAffected > 0 };
    } catch (error) {
      if (error.message.includes("ORA-00001")) {
        if (error.message.includes("UNIQUE_SPONSOR_NAME")) {
          return {
            success: false,
            message: "A sponsor with that name already exists."
          };
        }
      }

      if (error.message.includes("ORA-02291")) {
        return {
          success: false,
          message: "The specified tier level does not exist. Please choose a valid one."
        };
      }

      console.error("Error inserting sponsor:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  });
}


async function fetchSponsorTiers() {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `SELECT tier_level, amount_contributed FROM Sponsor_Tier`
      );
      return result.rows.map((row) => ({
        tier_level: row[0],
        amount_contributed: row[1],
      }));
    } catch (error) {
      console.error("Error fetching sponsor tiers:", error);
      throw error;
    }
  });
}

async function fetchSponsors() {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `SELECT sponsor_name, tier_level, point_of_contact FROM Sponsor`
      );
      return result.rows.map((row) => ({
        sponsor_name: row[0],
        tier_level: row[1],
        point_of_contact: row[2],
      }));
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      throw error;
    }
  });
}

async function updateSponsorTier({ oldName, newName, newAmount }) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `UPDATE Sponsor_Tier
           SET tier_level = :newName, amount_contributed = :newAmount
           WHERE tier_level = :oldName`,
          { newName, newAmount, oldName },
          { autoCommit: true }
      );

      if (result.rowsAffected === 0) {
        return {
          success: false,
          message: `Tier '${oldName}' not found. No updates made.`
        };
      }

      if (newAmount !== undefined && (isNaN(newAmount) || newAmount <= 0)) {
        return {
          success: false,
          message: "Please input a valid new amount greater than 0."
        };
      }

      return { success: true };
    } catch (error) {
      if (error.message.includes("ORA-00001")) {
        if (error.message.includes("SPONSOR_TIER_PK")) {
          return {
            success: false,
            message: "Tier level already exists. Try a different name."
          };
        } else if (error.message.includes("UNIQUE_AMOUNT_CONTRIBUTED")) {
          return {
            success: false,
            message: "Another tier already has this contribution amount. Choose a unique value."
          };
        } else {
          return {
            success: false,
            message: "A duplicate value was detected. Please check your data."
          };
        }
      }

      console.error("Error updating sponsor tier:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  });
}


async function updateSponsor({ oldSponsorName, newSponsorName, newTierLevel, newPointOfContact }) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `UPDATE Sponsor
           SET sponsor_name = :newSponsorName,
               tier_level = :newTierLevel,
               point_of_contact = :newPointOfContact
           WHERE sponsor_name = :oldSponsorName`,
          {
            newSponsorName,
            newTierLevel,
            newPointOfContact,
            oldSponsorName
          },
          { autoCommit: true }
      );

      if (result.rowsAffected === 0) {
        return {
          success: false,
          message: `Sponsor '${oldSponsorName}' not found. No updates made.`
        };
      }

      return { success: true };
    } catch (error) {
      if (error.message.includes("ORA-00001")) {
        if (error.message.includes("UNIQUE_SPONSOR_NAME")) {
          return {
            success: false,
            message: "A sponsor with that name already exists."
          };
        } else {
          return {
            success: false,
            message: "A duplicate value was detected. Please check your data."
          };
        }
      }

      if (error.message.includes("ORA-02291")) {
        return {
          success: false,
          message: "The tier level you picked does not exist in the available sponsor tiers."
        };
      }

      console.error("Error updating sponsor:", error);
      return { success: false, message: "Unexpected error occurred." };
    }
  });
}



async function deleteSponsor({ sponsorName }) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `DELETE FROM Sponsor WHERE sponsor_name = :sponsorName`,
          { sponsorName },
          { autoCommit: true }
      );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      await connection.rollback();
      throw error;
    }
  });
}

async function deleteSponsorTier({ tierLevel }) {
  return await withOracleDB(async (connection) => {
    try {
      const result = await connection.execute(
          `DELETE FROM Sponsor_Tier WHERE tier_level = :tierLevel`,
          { tierLevel },
          { autoCommit: true }
      );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error("Error deleting sponsor tier:", error);
      await connection.rollback();
      throw error;
    }
  });
}

async function dropTables() {
  return await withOracleDB(async (connection) => {
    try {
      await connection.execute(`DROP TABLE Sponsor CASCADE CONSTRAINTS`);
      await connection.execute(`DROP TABLE Sponsor_Tier CASCADE CONSTRAINTS`);

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error dropping sponsor tables:", error);
      await connection.rollback();
      throw error;
    }
  });
}

module.exports = {
  initiateSponsorTables,
  insertSponsorTier,
  insertSponsor,

  fetchSponsorTiers,
  fetchSponsors,

  updateSponsorTier,
  updateSponsor,

  deleteSponsor,
  deleteSponsorTier,

  dropTables
};
