import * as service from '../service/accountService.js';

export async function getAccounts (req, res) {
    try {
        const data = await service.getAccounts();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); 
    }
} 

export async function getAccountLog (req, res) {
    try {
        const data = await service.getAccountLog();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function regAccount ( req, res) {
    try {
        const data = await service.regAccount(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500).json(error);
    }
}