import * as debtData from "../data/debtData.js";
import * as transData from "../data/transData.js";
import * as assetData from "../data/assetData.js";
import * as empData from "../data/empData.js";

export async function regDebtInfo(req, res) {
  try {
    const hasDebt = await debtData.getDebtInfo(req);
    if (hasDebt) {
      res
        .status(300)
        .json({ error: { code: "10", message: "이미 등록되었습니다." } });
      return;
    }
    const debtInfo = await debtData.regDebtInfo(req);
    const cntUpdated = await transData.updateTransMoneyForDebt(req, debtInfo);
    const cntDelAsset = await assetData.deleteAssetNotUse(req);
    if (cntDelAsset.n > 0) console.log("자산항목 삭제: ", cntDelAsset.n);
    const cntDelEmp = await empData.deleteEmployeeNotUse(req);
    if (cntDelEmp.n > 0) console.log("직원항목 삭제: ", cntDelEmp.n);
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
