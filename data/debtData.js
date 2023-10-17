import debtModel from "../model/debtModel.js";
import { assetFilter } from "../utils/filter.js";

export async function regDebtInfo(req) {
  try {
    const {
      user,
      userId,
      corpNum,
      corpName,
      debtName,
      debtTypeCode,
      debtTypeName,
      transRemark,
    } = req.body;
    const debt = new debtModel({
      user,
      userId,
      corpNum,
      corpName,
      debtTypeName,
      debtTypeCode,
      debtName,
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
