const express = require('express');
const sponsorService = require('../services/entities/sponsorService');

const router = express.Router();

router.post("/initiate", async (req, res) => {
    try {
        const result = await sponsorService.initiateSponsorTables();
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to initiate sponsor tables", error: err.message });
    }
});

router.post("/insert-tier", async (req, res) => {
    const { tierLevel, amountContributed} = req.body;
    if (!tierLevel) {
        return res.status(400).json({ success: false, message: "Missing a tier level."});
    }

    try {
        const result = await sponsorService.insertSponsorTier(tierLevel, amountContributed);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert sponsor tier",
            error: err.message });
    }
});

router.post("/insert", async (req, res) => {
    const { sponsorName, tierLevel, pointOfContact } = req.body;
    if (!sponsorName || !tierLevel) {
        return res.status(400).json({ success: false, message: "Missing a sponsor name and/or a tier level" });
    }

    try {
        const result = await sponsorService.insertSponsor(sponsorName, tierLevel, pointOfContact);
        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to insert sponsor", error: err.message });
    }
});

router.get("/tiers", async (req, res) => {
    try {
        const sponsors = await sponsorService.fetchSponsorTiers();
        return res.json({ success: true, data: sponsors });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch sponsor tiers",
            error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const sponsors = await sponsorService.fetchSponsors();
        return res.json({ success: true, data: sponsors });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch sponsors", error: err.message });
    }
});

module.exports = router;