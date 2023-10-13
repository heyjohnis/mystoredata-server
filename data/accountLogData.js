import AccountLogModel from "../model/accountLogModel.js";
import { strToDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";

export async function regAccountLog(data) {
  const { user, withdraw, bankAccountNum, transDT, transRefKey } = data;
  try {
    const existingData = await AccountLogModel.findOne({
      user,
      bankAccountNum,
      withdraw,
      transDT,
      transRefKey,
    });
    if (existingData) {
      return;
    }
    await new AccountLogModel({
      ...data,
      transDate: strToDate(data.transDT),
      transMoney: parseInt(data.deposit) || parseInt(data.withdraw) * -1,
      transAssetNum: data.bankAccountNum,
    })
      .save()
      .then((res) => res._id);
  } catch (error) {
    throw error;
  }
}

export async function getAccountLogs(req) {
  const filter = {};
  if (req.query?.corpNum || req.body?.corpNum)
    filter.corpNum = req.query?.corpNum || req.body?.corpNum;
  if (req.query?.userId || req.body?.userId)
    filter.userId = req.query?.userId || req.body?.userId;
  if (
    (req.query?.fromAt || req.body?.fromAt) &&
    (req.query?.toAt || req.body?.toAt)
  ) {
    const toAt = new Date(`${req.query?.toAt || req.body?.toAt}`);
    toAt.setDate(toAt.getDate() + 1);
    filter.transDate = {
      $gte: new Date(`${req.query?.fromAt || req.body?.fromAt}`),
      $lte: new Date(toAt),
    };
  }
  console.log("getAccountLogs filter: ", filter);
  return await AccountLogModel.find(filter).sort({ transDate: -1 });
}
