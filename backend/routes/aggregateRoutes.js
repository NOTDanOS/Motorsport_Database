const express = require("express");
const router = express.Router();
const {
    vehicleCountByTeam,
    teamsWithMultipleVehicles,
    sponsorsFundingAllTeams
} = require("../services/queries/aggregateServices");

router.get("/vehicle-count-by-team", async (req, res) => {
    try {
        const data = await vehicleCountByTeam();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/teams-multiple-vehicles", async (req, res) => {
    try {
        const data = await teamsWithMultipleVehicles();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/sponsors-all-teams", async (req, res) => {
    try {
        const data = await sponsorsFundingAllTeams();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;