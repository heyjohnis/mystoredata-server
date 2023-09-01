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
  const filter = {};
  if (req.query.corpNum || req.body.corpNum)
    filter.CorpNum = req.query.corpNum || req.body.corpNum;
  if (req.query.userId || req.body.userId)
    filter.userId = req.query.userId || req.body.userId;
  if (
    (req.query.fromAt || req.body.fromAt) &&
    (req.query.toAt || req.body.toAt)
  )
    filter.transDate = {
      $gte: new Date(`${req.query.fromAt || req.body.fromAt}`),
      $lte: new Date(`${req.query.toAt || req.body.toAt}`),
    };

  return CardLogModel.find(filter).sort({ transDate: -1 });
}
