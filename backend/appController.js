const express = require('express');
const appService = require('./appService');

const router = express.Router();

const sponsorRoutes = require('./routes/sponsorRoutes');
const teamRoutes = require('./routes/teamRoutes');
const racingSeriesRoutes = require('./routes/racingSeriesRoutes');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

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

router.use('/sponsors', sponsorRoutes);
router.use('/teams', teamRoutes);
router.use('/racing-series', racingSeriesRoutes);
router.use('/drivers', driverRoutes);
router.use('/vehicles', vehicleRoutes);

module.exports = router;