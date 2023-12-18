import debtModel from "../model/debtModel.js";
import { assetFilter } from "../utils/filter.js";

export async function regDebtInfo(req) {
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
    const hasDebt = await getDebtInfo(req.body);
    if (hasDebt) {
      return hasDebt;
    }
    const debt = new debtModel({
      user,
      userId,
      corpNum,
      corpName,
      finItemCode,
      finItemName,
      finName,
      transRemark,
    }).save();
    return debt;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getDebtList(req) {
  const filter = assetFilter(req);
  return debtModel.find(filter);
}

export async function getDebtInfo(data) {
  const { userId, transRemark } = data;
  return await debtModel.findOne({ userId, transRemark });
}

export async function deleteDebtNotUse(req) {
  const { userId } = req.body;

  const notUseData = await debtModel.aggregate([
    {
      $lookup: {
        from: "transmoneys",
        localField: "_id",
        foreignField: "debt",
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
  return debtModel.deleteMany({ _id: { $in: ids } });
}
