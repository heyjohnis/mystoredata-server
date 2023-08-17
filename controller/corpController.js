import * as service from '../service/corpService.js';
import errorCase from '../middleware/baroError.js';

export async function checkCorpIsMember (req, res) {
    try {
        const data = await service.checkCorpIsMember(req);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
} 

export async function registCorp (req, res) {
    try {
        const data = await service.registCorp(req);
        res.status(200).json({ is_success: data});
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
} 

