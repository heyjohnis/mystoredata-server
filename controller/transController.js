import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";
import * as accountData from "../data/accountData.js";
import * as cardData from "../data/cardData.js";
// import { Tagger } from 'koalanlp/proc';
// import { EUNJEON } from 'koalanlp/API';

export async function mergeTrans(req, res) {
  try {
    const accountList = await accountData.getAccountList(req);
    const cardList = await cardData.getCardList(req);

    const accounts = await accountLogData
      .getAccountLogs(req)
      .catch((error) => console.log(error));
    for (const account of accounts) {
      const useKind = getUseKind(accountList, account.BankAccountNum);
      account.useKind = useKind;
      await transData
        .mergeTransMoney(account)
        .catch((error) => console.log(error));
    }
    const cards = await cardLogData
      .getCardLogs(req)
      .catch((error) => console.log(error));
    for (const card of cards) {
      const useKind = getUseKind(cardList, card.CardNum);
      card.useKind = useKind;
      await transData
        .mergeTransMoney(card)
        .catch((error) => console.log(error));
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}

function getUseKind(list, assetNum) {
  return (
    list.find(
      (account) => (account.bankAccountNum || account.cardNum) === assetNum
    )?.useKind || ""
  );
}

export async function mergeTransLogs(req, res) {
  const data = await transData
    .getTransMoney(req)
    .catch((error) => console.log(error));
  res.status(200).json({ data, error: {} });
}

export async function updateTrans(req, res) {
  const data = await transData
    .updateTransMoney(req)
    .catch((error) => console.log(error));
  res.status(200).json({ data, error: {} });
}
