const express = require('express');
const vehicleService = require('../services/entities/vehicleService');

const router = express.Router();

router.post("/initiate", async (req, res) => {
    try {
        const result = await vehicleService.initiateVehicleTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate car tables", error: err.message });
    }
});

router.post("/insert", async (req, res) => {
    const { model, yearFirstProduced, teamId, driverId, vehicleType, drivetrain = null, carType = null,
        engineCc = null, motorcycleType = null } = req.body;
    if (!model || !yearFirstProduced || !teamId || !driverId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (vehicleType === "Car" && (!drivetrain || !carType)) {
        return res.status(400).json({ success: false, message: "Missing required fields for Car" });
    }

    if (vehicleType === "Motorcycle" && (!engineCc || !motorcycleType)) {
        return res.status(400).json({ success: false, message: "Missing required fields for Motorcycle" });
    }

    try {
        const result = await vehicleService.insertVehicle(model, yearFirstProduced, teamId, driverId, vehicleType, {
            drivetrain,
            carType,
            engineCc,
            motorcycleType
        });

        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert vehicle", error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const vehicles = await vehicleService.fetchVehicles();
        return res.json({ success: true, data: vehicles });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch vehicles", error: err.message });
    }
});

module.exports = router;