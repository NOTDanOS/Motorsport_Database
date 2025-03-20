const express = require('express');
const fundService = require('../services/relationships/fundsService');

const router = express.Router();

router.post("/initiate", async (req, res) => {
    try {
        const result = await fundService.initiateFundsTable();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate fund table", error: err.message });
    }
});

router.post("/insert", async (req, res) => {
    const { sponsorID, teamID, contract_start, contract_end } = req.body;
    if (!sponsorID || !teamID) {
        return res.status(400).json({ success: false, message: "Missing a sponsor and/or team." });
    }

    try {
        const result = await fundService.insertFunds(sponsorID, teamID, contract_start, contract_end);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert into funds table", error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const funds = await fundService.fetchFunds();
        return res.json({ success: true, data: funds });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch funds", error: err.message });
    }
});

module.exports = router;
