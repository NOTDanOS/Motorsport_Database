import appService from '../../appService';

export default async function handler(req, res) {
    try {
        const initiateResult = await appService.initiateTeamTables();
        if (initiateResult) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to initiate team tables' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

