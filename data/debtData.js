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
