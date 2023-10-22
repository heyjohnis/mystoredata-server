import assetModel from "../model/assetModel.js";
import { assetFilter } from "../utils/filter.js";

export async function regAssetInfo(req) {
  const {
    user,
    userId,
    corpNum,
    corpName,
    finName,
    finItemCode,
    finItemName,
    transRemark,
  } = req.body;

  try {
    const asset = new assetModel({
      user,
      userId,
      corpNum,
      corpName,
      finItemCode,
      finItemName,
      finName,
      transRemark,
    }).save();
    return asset;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getAssetList(req) {
  const filter = assetFilter(req);
  return assetModel.find(filter);
}

export async function getAssetInfo(data) {
  const { userId, transRemark } = data;
  return await assetModel.findOne({ userId, transRemark: transRemark });
}
