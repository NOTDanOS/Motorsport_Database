import appService from '../appService';

export default async function handler(req, res) {
    try {
        const isConnect = await appService.testOracleConnection();
        if (isConnect) {
            return res.status(200).send('connected');
        } else {
            return res.status(500).send('unable to connect');
        }
    } catch (err) {
        return res.status(500).send('unable to connect');
    }
}
