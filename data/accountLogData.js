import AccountLogModel from "../model/accountLogModel.js";
import { strToDate } from "../utils/date.js";

export async function regAccountLog(data) {
  const { user, Withdraw, BankAccountNum, TransDT, TransRefKey } = data;
  try {
    const existingData = await AccountLogModel.findOne({
      user,
      BankAccountNum,
      Withdraw,
      TransDT,
      TransRefKey,
    });
    if (existingData) {
      return;
    }
    return await new AccountLogModel({
      ...data,
      transDate: strToDate(data.TransDT),
      transAssetNum: data.BankAccountNum,
    })
      .save()
      .then((res) => res._id);
  } catch (error) {
    throw error;
  }
}

export async function getAccountLogs(req) {
  const filter =
    req.query.corpNum || req.body.corpNum
      ? { CorpNum: req.query.corpNum || req.body.corpNum }
      : {};
  return AccountLogModel.find(filter).sort({ transDate: -1 });
}
