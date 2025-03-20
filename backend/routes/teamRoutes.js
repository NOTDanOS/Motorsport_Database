const express = require('express');
const teamService = require('../services/entities/teamService');

const router = express.Router();

router.post("/initiate", async (req, res) => {
    try {
        const result = await teamService.initiateTeamTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate team tables", error: err.message });
    }
});

router.post("/insert", async (req, res) => {
    const { principalName, teamName, yearFounded } = req.body;
    if (!principalName) {
        return res.status(400).json({ success: false, message: "Missing a team principal." });
    }

    try {
        const result = await teamService.insertTeamWithPrincipal(principalName, teamName, yearFounded);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert team", error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const teams = await teamService.fetchTeams();
        return res.json({ success: true, data: teams });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch teams", error: err.message });
    }
});

module.exports = router;
