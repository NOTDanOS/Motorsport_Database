const express = require('express');
const driver_Service = require('../services/entities/driverService');

const router = express.Router();

router.post("/initiate", async (req, res) => {
    try {
        const result = await driver_Service.initiateDriverTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate racing series tables",
            error: err.message });
    }
});

router.post("/insert", async (req, res) => {
    const { name, nationality, driver_number } = req.body;
    if (!name || !nationality || !driver_number) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const result = await driver_Service.insertDriver(name, nationality, driver_number);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert your driver",
            error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const drivers = await driver_Service.fetchDrivers();
        return res.json({ success: true, data: drivers });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch the drivers",
            error: err.message });
    }
});

module.exports = router;