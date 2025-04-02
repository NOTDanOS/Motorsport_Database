const express = require('express');
const appService = require('./appService');
const dbInitRoutes = require('./routes/initRoute');

const router = express.Router();

const sponsorRoutes = require('./routes/sponsorRoutes');
const teamRoutes = require('./routes/teamRoutes');
const racingSeriesRoutes = require('./routes/racingSeriesRoutes');
const driverRoutes = require('./routes/driverRoutes');
const engineerRoutes = require('./routes/engineerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
/*const fundsRoutes = require('./routes/fundsRoutes');*/

const aggregateRoutes = require('./routes/aggregateRoutes');

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
router.use('/engineers', engineerRoutes);
/*router.use('/funds', fundsRoutes);*/
router.use('/api/db', dbInitRoutes);
router.use('/aggregate', aggregateRoutes);

module.exports = router;