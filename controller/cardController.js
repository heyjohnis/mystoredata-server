import * as service from '../service/cardService.js';

export async function getCardLog (req, res) {
    try {
        const data = await service.getDailyCardLog();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
} 