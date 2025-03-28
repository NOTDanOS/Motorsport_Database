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

router.post("/update-tier", async (req, res) => {
    const { oldName, newName, newAmount } = req.body;

    if (!newName && newAmount === undefined) {
        return res.status(400).json({ success: false, message: "No values given to update." });
    }

    try {
        const result = await sponsorService.updateSponsorTier({
            oldName,
            newName,
            newAmount
        });

        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to update sponsor tier",
            error: err.message
        });
    }
});

router.post("/update", async (req, res) => {
    const { oldSponsorName, newSponsorName, newTierLevel, newPointOfContact } = req.body;

    if (!newSponsorName && newTierLevel && newPointOfContact === undefined) {
        return res.status(400).json({ success: false, message: "Double check your json file." });
    }

    try {
        const result = await sponsorService.updateSponsor({
            oldSponsorName,
            newSponsorName,
            newTierLevel,
            newPointOfContact
        });

        return res.json({ success: result });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to update sponsor",
            error: err.message
        });
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

router.delete("/:sponsorId", async(req, res) => {
    const { sponsorId } = req.params;

    try {
        const success = await sponsorService.deleteSponsorByID(parseInt(sponsorId));
        
        if (success) {
            return res.status(200).json({ success: true, message: "Sponsor deleted successfully" });
        } else {
            return res.status(404).json({ success: false, message: "Sponsor not found" });
        }
    } catch (err) {
        console.error("Error deleting sponsor:", err);
        return res.status(500).json({ success: false, message: "Error deleting sponsor" });
    }
});

router.delete("/tier/:tierLevel", async (req, res) => {
    const { tierLevel } = req.params;

    try {
        const success = await sponsorService.deleteSponsorTierByName(tierLevel);

        if (success) {
            return res.status(200).json({ success: true, message: "Sponsor tier deleted successfully" });
        } else {
            return res.status(404).json({ success: false, message: "Sponsor tier not found" });
        }
    } catch (err) {
        console.error("Error deleting sponsor tier:", err);
        return res.status(500).json({ success: false, message: "Error deleting sponsor tier" });
    }
})

module.exports = router;