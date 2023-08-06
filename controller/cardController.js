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

export async function regCard (req, res) {
    try {
        const data = await service.regCard(req, res);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
} 

export async function stopCard (req, res) {
    try {
        const data = await service.stopCard(req, res);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
} 

export async function getCardList (req, res) {
    try {
        const data = await service.getCardList(req, res);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
} 