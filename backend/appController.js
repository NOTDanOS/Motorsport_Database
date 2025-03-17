const express = require('express');
const appService = require('./appService');

const router = express.Router();


router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-sponsor-tables", async (req, res) => {
    const initiateResult = await appService.initiateSponsorTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-team-tables", async (req, res) => {
    const initiateResult = await appService.initiateTeamTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/insert-sponsor-tier", async (req, res) => {
    const { tierLevel, amountContributed } = req.body;
    const insertResult = await appService.insertSponsorTier(tierLevel, amountContributed);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/insert-sponsor", async (req, res) => {
    const { sponsorName, tierLevel, pointOfContact } = req.body;
    const insertResult = await appService.insertSponsor(sponsorName, tierLevel, pointOfContact);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-team", async (req, res) => {
    const { principalName, teamName, yearFounded } = req.body;

    const createResult = await appService.insertTeamWithPrincipal(principalName, teamName, yearFounded);

    if (createResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


module.exports = router;