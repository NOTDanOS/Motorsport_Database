const express = require('express');
const rs_Service = require('../services/entities/racingSeriesService');

const router = express.Router();

// RACING section
router.post("/initiate", async (req, res) => {
    try {
        const result = await rs_Service.initiateRacingTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate racing series tables",
            error: err.message });
    }
});

router.post("/insert", async (req, res) => {
    const { rsName, division, governingBody } = req.body;
    if (!rsName || !division || !governingBody) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const result = await rs_Service.insertRacingSeries(rsName, division, governingBody);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert your racing series", error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const teams = await rs_Service.fetchRacingSeries();
        return res.json({ success: true, data: teams });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch the racing series table",
            error: err.message });
    }
});

module.exports = router;