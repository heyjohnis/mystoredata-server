import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";

// import { Tagger } from 'koalanlp/proc';
// import { EUNJEON } from 'koalanlp/API';

export async function mergeTrans(req, res) {
  try {
    const accounts = await accountLogData
      .getAccountLogs(req)
      .catch((error) => console.log(error));
    for (const account of accounts) {
      await transData
        .mergeTransMoney(account)
        .catch((error) => console.log(error));
    }
    const cards = await cardLogData
      .getCardLogs(req)
      .catch((error) => console.log(error));
    for (const card of cards) {
      await transData
        .mergeTransMoney(card)
        .catch((error) => console.log(error));
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}

export async function mergeTransLogs(req, res) {
  const data = await transData
    .getTransMoney(req)
    .catch((error) => console.log(error));
  res.status(200).json({ data, error: {} });
}
