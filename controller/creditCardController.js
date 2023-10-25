import * as creditCardData from "../data/creditCardData.js";
import * as transData from "../data/transData.js";

export async function regCreditCardInfo(req, res) {
  try {
    const hasCreditCard = await creditCardData.getCreditCardInfo(req);
    if (hasCreditCard) {
      res
        .status(300)
        .json({ error: { code: "10", message: "이미 등록되었습니다." } });
      return;
    }
    const debtInfo = await creditCardData.regCreditCardInfo(req);
    res.status(200).json(debtInfo);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getCreditCardList(req, res) {
  try {
    const debts = await creditCardData.getCreditCardList(req);
    res.status(200).json(debts);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getCashedPayableLogs(req, res) {
  try {
    const data = await transData.getCashedPayableLogs(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
