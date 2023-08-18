import * as cardLogData from '../data/cardLogData.js';
import * as accountLogData from '../data/accountLogData.js';

export async function mergeTrans( req, res ) {
    try {
        const cards = cardLogData.getCardLogs(req);
        const accounts = accountLogData.getAccountLogs(req);
        

    } catch (error) {

    }
} 