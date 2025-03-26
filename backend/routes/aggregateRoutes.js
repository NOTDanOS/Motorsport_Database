const express = require("express");
const router = express.Router();
const {
    engineersPerTeam,
    teamsWithMultipleEngineers,
    sponsorsWithAllTiers
} = require("../services/queries/aggregateServices");

router.get("/engineers-per-team", async (req, res) => {
    try {
        const data = await engineersPerTeam();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/teams-with-multiple-engineers", async (req, res) => {
    try {
        const data = await teamsWithMultipleEngineers();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/sponsors-with-all-tiers", async (req, res) => {
    try {
        const data = await sponsorsWithAllTiers();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;