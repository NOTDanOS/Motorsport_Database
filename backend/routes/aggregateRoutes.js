const express = require("express");
const router = express.Router();
const {
  engineersPerTeam,
  teamsWithMultipleEngineers,
  experiencedEngineeringTeams,
  teamsInAllRacingSeries,
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

router.get("/experienced-engineering-teams", async (req, res) => {
  try {
    const data = await experiencedEngineeringTeams();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/teams-in-all-series", async (req, res) => {
  try {
    const data = await teamsInAllRacingSeries();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
