const {withOracleDB} = require("../../utils/oracleHelper");
const {tableExists} = require("../../utils/tableExists");

async function insertSponsorTiersIfNotExists() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT COUNT(*) FROM Sponsor_Tier`);

        if (result.rows[0][0] === 0) {
            console.log("Inserting preset sponsor tiers...");
            await connection.executeMany(
                `INSERT INTO Sponsor_Tier (tier_level, amount_contributed) VALUES (:tier, :amount)`,
                [
                    { tier: 'Bronze', amount: 100000 },
                    { tier: 'Silver', amount: 500000 },
                    { tier: 'Gold', amount: 1000000 },
                    { tier: 'Platinum', amount: 5000000 },
                    { tier: 'Diamond', amount: 10000000 }
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
            const sponsorTierExists = await tableExists('Sponsor_Tier');
            const sponsorExists = await tableExists('Sponsor');
            const fundsExists = await tableExists('funds');

            if (sponsorTierExists && sponsorExists && fundsExists) {
                console.log("Sponsor tables already exist. Skipping creation.");
                return false;
            }

            console.log("Creating sponsor tables...");

            if (!sponsorTierExists) {
                await connection.execute(`
                    CREATE TABLE Sponsor_Tier (
                        tier_level VARCHAR2(50) PRIMARY KEY,
                        amount_contributed NUMBER CHECK (amount_contributed >= 0)
                    )
                `);
            }

            await insertSponsorTiersIfNotExists();

            if (!sponsorExists) {
                await connection.execute(`
                    CREATE TABLE Sponsor(
                        sponsor_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        sponsor_name VARCHAR2(50) NOT NULL UNIQUE,
                        tier_level VARCHAR2(50),
                        point_of_contact VARCHAR2(100),
                        CONSTRAINT fk_sponsor_tier FOREIGN KEY (tier_level) 
                            REFERENCES Sponsor_Tier(tier_level) 
                            ON DELETE SET NULL
                    )
                `);
            }

            /*if (!fundsExists) {
                await connection.execute(`
                    CREATE TABLE Funds (
                        sponsor_id NUMBER PRIMARY KEY,
                        team_id NUMBER PRIMARY KEY,
                        contract_start_date DATE,
                        contract_end_date DATE,
                        CONSTRAINT fk_sponsor_id FOREIGN KEY (sponsor_id) 
                            REFERENCES Sponsor(sponsor_id) 
                            ON DELETE CASCADE FOREIGN KEY (sponsor_id),
                        CONSTRAINT fk_team_id FOREIGN KEY (team_id)
                            REFERENCES Team(team_id)
                            ON DELETE CASCADE FOREIGN KEY (team_id)
                    )
                `);
            }*/

            console.log("Sponsor tables created successfully.");
            return true;
        } catch (error) {
            console.error("Error checking/creating sponsor tables:", error);
            return false;
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

            await connection.commit();

            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting sponsor tiers:", error);

            await connection.rollback();
            return false;
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

            await connection.commit();

            return result.rowsAffected > 0;
        } catch (error) {
            console.error("Error inserting sponsor:", error);

            await connection.rollback();
            return false;
        }
    });
}

async function fetchSponsorTiers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT tier_level, amount_contributed FROM Sponsor_Tier`);
        return result.rows.map(row => ({
            tier_level: row[0],
            amount_contributed: row[1]
        }));
    });
}

async function fetchSponsors() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT sponsor_name, tier_level, point_of_contact FROM Sponsor`);
        return result.rows.map(row => ({
            sponsor_name: row[0],
            tier_level: row[1],
            point_of_contact: row[2]
        }));
    });
}

async function updateSponsorTier({ oldName, newName, newAmount }) {
    return await withOracleDB(async (connection) => {
        const updates = [];
        const params = { oldName };

        if (newName) {
            updates.push(`tier_level = :newName`);
            params.newName = newName;
        }

        if (newAmount !== undefined && newAmount !== null) {
            updates.push(`amount_contributed = :newAmount`);
            params.newAmount = newAmount;
        }

        if (updates.length === 0) {
            console.log("No fields to update for sponsor tier.");
            return false;
        }

        const query = `
            UPDATE Sponsor_Tier
            SET ${updates.join(', ')}
            WHERE tier_level = :oldName
        `;

        const result = await connection.execute(query, params, { autoCommit: true });
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error updating sponsor tier:", err);
        return false;
    });
}



async function updateSponsor({ oldSponsorName, newSponsorName, newTierLevel, newPointOfContact }) {
    return await withOracleDB(async (connection) => {
        const updates = [];
        const params = { oldSponsorName };

        if (newSponsorName) {
            updates.push(`sponsor_name = :newSponsorName`);
            params.newSponsorName = newSponsorName;
        }

        if (newTierLevel) {
            updates.push(`tier_level = :newTierLevel`);
            params.newTierLevel = newTierLevel;
        }

        if (newPointOfContact) {
            updates.push(`point_of_contact = :newPointOfContact`);
            params.newPointOfContact = newPointOfContact;
        }

        if (updates.length === 0) {
            console.log("No fields to update.");
            return false;
        }

        const query = `
            UPDATE Sponsor
            SET ${updates.join(', ')}
            WHERE sponsor_name = :oldSponsorName
        `;

        const result = await connection.execute(query, params, { autoCommit: true });
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error updating sponsor:", err);
        return false;
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


}