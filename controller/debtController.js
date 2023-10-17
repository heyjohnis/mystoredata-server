import * as debtData from "../data/debtData.js";
import * as transData from "../data/transData.js";

export async function regDebtInfo(req, res) {
  try {
    const debtInfo = await debtData.regDebtInfo(req);
    const cntUpdated = await transData.updateTransMoneyForDebt(req, debtInfo);
    res.status(200).json(cntUpdated);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getDebtList(req, res) {
  try {
    const debts = await debtData.getDebtList(req);
    res.status(200).json(debts);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
