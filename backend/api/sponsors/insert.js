import express from 'express';
import appService from '../../appService';

const router = express.Router();

router.post('/', async (req, res) => {
    const { sponsorName, tierLevel, pointOfContact } = req.body;
    try {
        const insertResult = await appService.insertSponsor(sponsorName, tierLevel, pointOfContact);
        if (insertResult) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
