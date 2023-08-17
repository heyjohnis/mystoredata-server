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
        const data = await service.regCard(req);
        if(code > 0) {
            res.status(200).json({success: true});    
        } else {
            res.status(400).json(errorCase(code));
        } 
    } catch (error) {
        res.status(500).json(error);
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

export async function deleteCard (req, res) {
    try {
        const code = await service.deleteCard(req);
        if(code > 0) {
            res.status(200).json({success: true});    
        } else {
            res.status(400).json(errorCase(code));
        } 
    } catch (error) {
        res.status(500).json(error);
    }
}