import * as assetData from "../data/assetData.js";
import * as transData from "../data/transData.js";
import * as debtData from "../data/debtData.js";
import * as empData from "../data/empData.js";

export async function regAssetInfo(req, res) {
  try {
    const hasAsset = await assetData.getAssetInfo(req);
    if (hasAsset) {
      res
        .status(300)
        .json({ error: { code: "10", message: "이미 등록되었습니다." } });
      return;
    }
    const assetInfo = await assetData.regAssetInfo(req);
    const cntUpdated = await transData.updateTransMoneyForAsset(req, assetInfo);
    const cntDelDebt = await debtData.deleteDebtNotUse(req);
    if (cntDelDebt?.n > 0) console.log("부채항목 삭제: ", cntDelDebt.n);
    const cntDelEmp = await empData.deleteEmployeeNotUse(req);
    if (cntDelEmp?.n > 0) console.log("직원항목 삭제: ", cntDelEmp.n);
    res.status(200).json(cntUpdated);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getAssetList(req, res) {
  try {
    const debts = await assetData.getAssetList(req);
    res.status(200).json(debts);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteAssetNotUse(req, res) {
  try {
    const items = await assetData.deleteAssetNotUse(req);
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function saveAssetInfo(req, res) {
  try {
    const item = await assetData.saveAssetInfo(req);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteAssetInfo(req, res) {
  try {
    const item = await assetData.deleteAssetInfo(req);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
