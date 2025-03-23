const express = require('express');
const engineerService = require('../services/entities/engineerService');
const sponsorService = require("../services/entities/sponsorService");

const router = express.Router();

router.post("/initiate", async (req, res) => {
    try {
        const result = await engineerService.initiateEngineerTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate car tables", error: err.message });
    }
});

router.post("/insert-team", async (req, res) => {
    const { teamName, dept, HQ, yearsLed } = req.body;
    if (!teamName) {
        return res.status(400).json({ success: false, message: "Missing a team name" });
    }

    try {
        const result = await engineerService.insertEngineeringTeam(teamName, dept, HQ, yearsLed);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert engineering team", error: err.message });
    }
});

router.post("/insert-assignment", async (req, res) => {
    const { name, proficiency, years_experience, eng_team_id } = req.body;

    // no if statement since we didn't restrict this, but maybe we should???

    try {
        const result = await engineerService.insertEngineeringAssignment(name, proficiency,
            years_experience, eng_team_id);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert engineering assignment", error: err.message });
    }
});

router.get("/assignments", async (req, res) => {
    try {
        const assignments = await engineerService.fetchEngineeringAssignment();
        return res.json({ success: true, data: assignments });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch engineering assignments", error: err.message });
    }
});

router.post("/update-assignment", async (req, res) => {
    const { oldName, newName, newProficiency, newYearsExperience, newTeamId } = req.body;

    if (!newName && newProficiency && newYearsExperience && newTeamId === undefined) {
        return res.status(400).json({ success: false, message: "Double check your json file." });
    }

    try {
        const result = await engineerService.updateEngineeringAssignment({
            oldName,
            newName,
            newProficiency,
            newYearsExperience,
            newTeamId
        });

        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to update engineering team",
            error: err.message
        });
    }
});

router.get("/teams", async (req, res) => {
    try {
        const teams = await engineerService.fetchEngineeringTeams();
        return res.json({ success: true, data: teams });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch engineering teams", error: err.message });
    }
});

router.post("/update-team", async (req, res) => {
    const { oldTeamName, newTeamName, newDepartment, newAddress } = req.body;

    if (!newTeamName && newDepartment && newAddress === undefined) {
        return res.status(400).json({ success: false, message: "Double check your json file." });
    }

    try {
        const result = await engineerService.updateEngineeringTeam({
            oldTeamName,
            newTeamName,
            newDepartment,
            newAddress
        });

        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to update engineering team",
            error: err.message
        });
    }
});

module.exports = router;
