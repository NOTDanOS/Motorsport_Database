const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    try {
        const isConnected = await appService.testOracleConnection();
        return res.json({ success: isConnected });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Database connection failed", error: err.message });
    }
});

//SPONSOR Section
router.post("/initiate-sponsor-tables", async (req, res) => {
    try {
        const result = await appService.initiateSponsorTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate sponsor tables", error: err.message });
    }
});

router.post("/insert-sponsor-tier", async (req, res) => {
    const { tierLevel, amountContributed } = req.body;
    if (!tierLevel || amountContributed == null) {
        return res.status(400).json({ success: false, message: "Missing tierLevel or amountContributed" });
    }

    try {
        const result = await appService.insertSponsorTier(tierLevel, amountContributed);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert sponsor tier", error: err.message });
    }
});

router.post("/insert-sponsor", async (req, res) => {
    const { sponsorName, tierLevel, pointOfContact } = req.body;
    if (!sponsorName) {
        return res.status(400).json({ success: false, message: "Missing sponsorName" });
    }

    try {
        const result = await appService.insertSponsor(sponsorName, tierLevel, pointOfContact);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert sponsor", error: err.message });
    }
});

router.get("/get-sponsor-tiers", async (req, res) => {
    try {
        const sponsors = await appService.fetchSponsorTiers();
        return res.json({ success: true, data: sponsors });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch sponsor tiers",
            error: err.message });
    }
});

router.get("/get-sponsors", async (req, res) => {
    try {
        const sponsors = await appService.fetchSponsors();
        return res.json({ success: true, data: sponsors });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch sponsors", error: err.message });
    }
});

// TEAM section
router.post("/initiate-team-tables", async (req, res) => {
    try {
        const result = await appService.initiateTeamTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate team tables", error: err.message });
    }
});

router.post("/insert-team", async (req, res) => {
    const { principalName, teamName, yearFounded } = req.body;
    if (!principalName || !teamName || !yearFounded) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const result = await appService.insertTeamWithPrincipal(principalName, teamName, yearFounded);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert team", error: err.message });
    }
});

router.get("/get-teams", async (req, res) => {
    try {
        const teams = await appService.fetchTeams();
        return res.json({ success: true, data: teams });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch teams", error: err.message });
    }
});

module.exports = router;