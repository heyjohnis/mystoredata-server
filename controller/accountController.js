import * as service from '../service/accountService.js';
import errorCase from '../middleware/baroError.js';
import * as accountData from '../data/accountData.js';
export async function getAccounts (req, res) {
    try {
        const data = await service.getAccounts( req );
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); 
    }
} 

export async function regAcountLog (req, res) {
    try {
        const code = await service.regAcountLog(req);
        if(code > 0) {
            res.status(200).json({success: true});    
        } else {
            res.status(400).json(errorCase(code));
        }   
    } catch (error) {
        res.sendStatus(500).json(error);
    }
}

export async function getAccountLogs (req, res) {
    try {
        const logs = await accountData.getAccountLogs(req)
        res.status(200).json({ logs });
    } catch (error) {
        res.sendStatus(500).json(error);
    }
}

export async function regAccount ( req, res) {
    try {
        const code = await service.regUserAccount(req);
        if(code > 0) {
            res.status(200).json({success: true});    
        } else {
            res.status(400).json(errorCase(code));
        }        
    } catch (error) {
        res.sendStatus(500).json(error);
    }
}

export async function deleteAccount ( req, res) {
    try {
        const code = await service.deleteAccount(req);
        if(code > 0) {
            res.status(200).json({success: true});    
        } else {
            res.status(400).json(errorCase(code));
        }        
    } catch (error) {
        res.sendStatus(500).json(error);
    }
}