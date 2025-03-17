import appService from '../../appService';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { principalName, teamName, yearFounded } = req.body;

    // Validate input
    if (!principalName || !teamName || !yearFounded) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const createResult = await appService.insertTeamWithPrincipal(principalName, teamName, yearFounded);
        if (createResult) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to insert team' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

