const express = require('express');
const router = express.Router();
const { initializeAllTables } = require('../services/entities/initService');


router.post('/initialize-all', async (req, res) => {
    try {
        const result = await initializeAllTables();
        
        if (result.success) {
            res.status(200).json({
                message: "All database tables initialized successfully",
                details: result.results
            });
        } else {
            res.status(500).json({
                message: "Failed to initialize all database tables",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in initialize-all endpoint:", error);
        res.status(500).json({
            message: "An error occurred during database initialization",
            error: error.message
        });
    }
});

module.exports = router;