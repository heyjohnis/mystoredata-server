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
    return await new AccountLogModel({
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
  const filter = assetFilter(req);
  console.log({ filter });
  return await AccountLogModel.find(filter).sort({ transDate: -1 });
}
