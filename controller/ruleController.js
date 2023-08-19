import * as cardLogData from '../data/cardLogData.js';
import * as accountLogData from '../data/accountLogData.js';
import * as transData from '../data/transData.js';

export async function mergeTransLogs( req, res ) {
    const data = await transData.getTransMoney(req).catch(error => console.log(error));
    res.status(200).json({ data, error: {}});
}