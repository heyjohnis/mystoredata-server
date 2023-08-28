import CardLogModel from "../model/cardLogModel.js";
import { strToDate } from "../utils/date.js";

export async function regCardLog(data) {
  const { CorpNum, CardNum, CardApprovalCost, UseStoreNum, UseDT } = data;
  try {
    const existingData = await CardLogModel.findOne({
      CorpNum,
      CardNum,
      CardApprovalCost,
      UseStoreNum,
      UseDT,
    });
    if (!existingData) {
      await new CardLogModel({
        ...data,
        transDate: strToDate(data.UseDT),
        transAssetNum: CardNum,
      }).save();
    }
  } catch (error) {
    throw error;
  }
}

export async function getCardLogs(req) {
  const filter =
    req.query.corpNum || req.body.corpNum
      ? { CorpNum: req.query.corpNum || req.body.corpNum }
      : {};
  return CardLogModel.find(filter).sort({ transDate: -1 });
}
