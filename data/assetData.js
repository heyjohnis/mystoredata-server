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
    const hasAsset = await getAssetInfo(req.body);
    if (hasAsset) {
      return hasAsset;
    }
    const asset = new assetModel({
      user,
      userId,
      corpNum,
      corpName,
      finItemCode,
      finItemName,
      finName,
      transRemark,
      itemName: finName,
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

export async function deleteAssetNotUse(req) {
  const { userId } = req.body;
  const notUseData = await assetModel.aggregate([
    {
      $lookup: {
        from: "transmoneys",
        localField: "_id",
        foreignField: "asset",
        as: "joinedData",
      },
    },
    {
      $addFields: {
        count: { $size: "$joinedData" },
      },
    },
    {
      $match: {
        count: 0,
        userId,
      },
    },
  ]);

  const ids = notUseData.map((item) => item._id);
  return assetModel.deleteMany({ _id: { $in: ids } });
}

export async function saveAssetInfo(req) {
  const {
    _id,
    user,
    userId,
    corpNum,
    corpName,
    finName,
    finItemCode,
    finItemName,
    transRemark,
    itemKind,
    itemTypeName,
    currentAmount,
    defaultDate,
    amount,
  } = req.body;
  try {
    const asset = await assetModel.findOneAndUpdate(
      { _id },
      {
        user,
        userId,
        corpNum,
        corpName,
        finName,
        finItemCode,
        finItemName,
        transRemark,
        itemKind,
        itemTypeName,
        currentAmount,
        defaultDate,
        amount,
      },
      { upsert: true, new: true }
    );
    return asset;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
