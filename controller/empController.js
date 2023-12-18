import * as empData from "../data/empData.js";
import * as transData from "../data/transData.js";
import * as assetData from "../data/assetData.js";
import * as debtData from "../data/debtData.js";

export async function regEmployeeInfo(req, res) {
  try {
    const empDataInfo = await empData.regEmployeeInfo(req);
    const updatedData = await transData.updateTransMoneyForEmployee(
      req,
      empDataInfo
    );
    const cntDelAsset = await assetData.deleteAssetNotUse(req);
    if (cntDelAsset?.n > 0) console.log("자산항목 삭제: ", cntDelAsset.n);
    const cntDelDebt = await debtData.deleteDebtNotUse(req);
    if (cntDelDebt?.n > 0) console.log("부채항목 삭제: ", cntDelDebt.n);
    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getEmployeeList(req, res) {
  try {
    const emps = await empData.getEmployeeList(req);
    res.status(200).json(emps);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteEmployeeNotUse(req, res) {
  try {
    const emps = await empData.deleteEmployeeNotUse(req);
    res.status(200).json(emps);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
