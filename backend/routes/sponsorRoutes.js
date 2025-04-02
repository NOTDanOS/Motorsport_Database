const express = require("express");
const sponsorService = require("../services/entities/sponsorService");

const router = express.Router();

router.post("/initiate", async (req, res) => {
  try {
    const result = await sponsorService.initiateSponsorTables();
    return res.json({ success: result });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to initiate sponsor tables",
        error: err.message,
      });
  }
});

router.post("/insert-tier", async (req, res) => {
  const { tierLevel, amountContributed } = req.body;

  try {
    const result = await sponsorService.insertSponsorTier(tierLevel, amountContributed);

    if (result.success) {
      return res.json({ success: true, message: "Tier inserted successfully!" });
    } else {
      return res.status(409).json({ success: false, message: result.message });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to insert sponsor tier.",
      error: err.message
    });
  }
});

router.post("/insert", async (req, res) => {
  const { sponsorName, tierLevel, pointOfContact } = req.body;

  if (!sponsorName || !tierLevel) {
    return res.status(400).json({
      success: false,
      message: "Missing a sponsor name and/or a tier level.",
    });
  }

  try {
    const result = await sponsorService.insertSponsor(
        sponsorName,
        tierLevel,
        pointOfContact
    );

    if (result.success) {
      return res.json({ success: true, message: "Sponsor inserted successfully!" });
    } else {
      return res.status(409).json({ success: false, message: result.message });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to insert sponsor.",
      error: err.message,
    });
  }
});

router.post("/update-tier", async (req, res) => {
  const { oldName, newName, newAmount } = req.body;

  if (!oldName) {
    return res.status(400).json({ success: false, message: "Missing tier name to update." });
  }

  if (!newName && newAmount === undefined) {
    return res.status(400).json({ success: false, message: "No values given to update." });
  }

  try {
    const result = await sponsorService.updateSponsorTier({
      oldName,
      newName,
      newAmount,
    });

    if (result.success) {
      return res.json({ success: true, message: "Sponsor tier updated successfully." });
    } else {
      return res.status(409).json({ success: false, message: result.message });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update sponsor tier",
      error: err.message,
    });
  }
});


router.post("/update", async (req, res) => {
  const { oldSponsorName, newSponsorName, newTierLevel, newPointOfContact } = req.body;

  if (!oldSponsorName) {
    return res.status(400).json({ success: false, message: "Missing sponsor name to update." });
  }

  if (!newSponsorName && !newTierLevel && newPointOfContact === undefined) {
    return res.status(400).json({ success: false, message: "No values given to update." });
  }

  try {
    const result = await sponsorService.updateSponsor({
      oldSponsorName,
      newSponsorName,
      newTierLevel,
      newPointOfContact,
    });

    if (result.success) {
      return res.json({ success: true, message: "Sponsor updated successfully." });
    } else {
      return res.status(409).json({ success: false, message: result.message });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update sponsor",
      error: err.message,
    });
  }
});



router.get("/tiers", async (req, res) => {
  try {
    const sponsors = await sponsorService.fetchSponsorTiers();
    return res.json({ success: true, data: sponsors });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch sponsor tiers",
        error: err.message,
      });
  }
});

router.get("/", async (req, res) => {
  try {
    const sponsors = await sponsorService.fetchSponsors();
    return res.json({ success: true, data: sponsors });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch sponsors",
        error: err.message,
      });
  }
});

router.delete("/delete", async (req, res) => {
  const { sponsorName } = req.body;

  if (!sponsorName) {
    return res
      .status(400)
      .json({ success: false, message: "Missing sponsor name" });
  }

  try {
    const success = await sponsorService.deleteSponsor({
      sponsorName,
    });

    if (success) {
      return res
        .status(200)
        .json({ success: true, message: "Sponsor deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Sponsor not found" });
    }
  } catch (err) {
    console.error("Error deleting sponsor:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error deleting sponsor",
        error: err.message,
      });
  }
});

router.delete("/delete-tier", async (req, res) => {
  const { tierLevel } = req.body;

  if (!tierLevel) {
    return res
      .status(400)
      .json({ success: false, message: "Missing tier level" });
  }

  try {
    const success = await sponsorService.deleteSponsorTier({
      tierLevel,
    });

    if (success) {
      return res
        .status(200)
        .json({ success: true, message: "Sponsor tier deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Sponsor tier not found" });
    }
  } catch (err) {
    console.error("Error deleting sponsor tier:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error deleting sponsor tier",
        error: err.message,
      });
  }
});

router.delete("/drop", async (req, res) => {
  try {
    const dropped = await sponsorService.dropTables();
    if (dropped) {
      return res.json({ success: true, message: "Sponsor tables dropped successfully." });
    } else {
      return res.status(400).json({ success: false, message: "Tables were not dropped (may not exist)." });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete sponsor tables",
      error: err.message,
    });
  }
});

module.exports = router;
