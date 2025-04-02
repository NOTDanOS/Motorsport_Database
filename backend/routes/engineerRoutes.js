const express = require("express");
const engineerService = require("../services/entities/engineerService");

const router = express.Router();

router.post("/initiate", async (req, res) => {
  try {
    const result = await engineerService.initiateEngineerTables();
    return res.json({ success: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to initiate engineer tables",
      error: err.message,
    });
  }
});

router.post("/insert-team", async (req, res) => {
  const { teamName, dept, HQ } = req.body;
  if (!teamName) {
    return res
      .status(400)
      .json({ success: false, message: "Missing a team name" });
  }

  try {
    const result = await engineerService.insertEngineeringTeam(
      teamName,
      dept,
      HQ
    );
    return res.json({ success: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to insert engineering team",
      error: err.message,
    });
  }
});

router.post("/insert-assignment", async (req, res) => {
  const { name, proficiency, years_experience, eng_team_id } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Missing engineer name" });
  }

  try {
    const result = await engineerService.insertEngineeringAssignment(
      name,
      proficiency,
      years_experience,
      eng_team_id
    );
    return res.json({ success: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to insert engineering assignment",
      error: err.message,
    });
  }
});

router.get("/assignments", async (req, res) => {
  try {
    const assignments = await engineerService.fetchEngineeringAssignment();
    return res.json({ success: true, data: assignments });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch engineering assignments",
      error: err.message,
    });
  }
});

router.put("/update-assignment", async (req, res) => {
  const { oldName, newName, newProficiency, newYearsExperience, newTeamId } =
    req.body;

  if (!oldName) {
    return res.status(400).json({
      success: false,
      message: "Missing original engineer name (oldName)",
    });
  }

  if (
    !newName &&
    !newProficiency &&
    newYearsExperience === undefined &&
    newTeamId === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "No fields provided to update" });
  }

  try {
    const result = await engineerService.updateEngineeringAssignment({
      oldName,
      newName,
      newProficiency,
      newYearsExperience,
      newTeamId,
    });

    return res.json({ success: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update engineering assignment",
      error: err.message,
    });
  }
});

router.get("/teams", async (req, res) => {
  try {
    const teams = await engineerService.fetchEngineeringTeams();
    return res.json({ success: true, data: teams });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch engineering teams",
      error: err.message,
    });
  }
});

router.post("/assignment-projection", async (req, res) => {
  try {
    const { fields } = req.body;
    const eng_proj = await engineerService.fetchProjectedColumns({ fields });
    return res.json({ success: true, data: eng_proj });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Projection failed" });
  }
});

router.put("/update-team", async (req, res) => {
  const { oldTeamName, newTeamName, newDept, newHQ } = req.body;

  if (!oldTeamName) {
    return res.status(400).json({
      success: false,
      message: "Missing original team name (oldTeamName)",
    });
  }

  if (!newTeamName && !newDept && !newHQ) {
    return res
      .status(400)
      .json({ success: false, message: "No fields provided to update" });
  }

  try {
    const result = await engineerService.updateEngineeringTeam({
      oldTeamName,
      newTeamName,
      newDept,
      newHQ,
    });

    return res.json({ success: result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update engineering team",
      error: err.message,
    });
  }
});

router.delete("/delete", async (req, res) => {
  const { tableName, conditions, partial } = req.body;

  try {
    const deletion = await engineerService.deleteRows(
      tableName,
      conditions,
      partial === true
    );
    return res.json({ success: true, deleted: deletion });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete row(s)",
      error: err.message,
    });
  }
});

router.post("/search", async (req, res) => {
  try {
    const { conditions } = req.body;

    if (!conditions || conditions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No search conditions provided" });
    }

    const engineers = await engineerService.searchEngineers(conditions);

    return res.json({ success: true, data: engineers });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to search engineers",
      error: err.message,
    });
  }
});

router.post("/join", async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const engineers = await engineerService.getEngineersByDepartment(
      department
    );

    return res.json({ success: true, data: engineers });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch engineers by department",
      error: err.message,
    });
  }
});

module.exports = router;
