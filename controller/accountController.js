import * as service from '../service/accountService.js';
import errorCase from '../middleware/baroError.js';

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
        const code = await service.getAccountLog(req);
        if(code > 0) {
            res.status(200).json({success: true});    
        } else {
            res.status(400).json(errorCase(code));
        }   
    } catch (error) {
        res.sendStatus(500).json(error);
    }
}

export async function regAccount ( req, res) {
    try {
        const code = await service.regAccount(req);
        if(code > 0) {
            res.status(200).json({success: true});    
        } else {
            res.status(400).json(errorCase(code));
        }        
    } catch (error) {
        res.sendStatus(500).json(error);
    }
}