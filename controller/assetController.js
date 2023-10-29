import * as assetData from "../data/assetData.js";
import * as transData from "../data/transData.js";

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
