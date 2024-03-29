import CardLogModel from "../model/cardLogModel.js";
import { strToDate } from "../utils/date.js";

export async function regCardLog(data) {
  const { corpNum, cardNum, cardApprovalCost, useStoreNum, useDT } = data;
  try {
    const existingData = await CardLogModel.findOne({
      corpNum,
      cardNum,
      cardApprovalCost,
      useStoreNum,
      useDT,
    });
    if (!existingData) {
      await new CardLogModel({
        ...data,
        transDate: strToDate(data.useDT),
        transMoney: parseInt(data.cardApprovalCost) * -1,
        transAssetNum: cardNum,
      }).save();
    }
  } catch (error) {
    throw error;
  }
}

export async function getCardLogs(req) {
  const filter = { cardApprovalType: { $ne: "거절" } };
  if (req.query?.corpNum || req.body?.corpNum)
    filter.corpNum = req.query?.corpNum || req.body?.corpNum;
  if (req.query?.userId || req.body?.userId)
    filter.userId = req.query?.userId || req.body?.userId;
  if (req.query?.tradeKind || req.body?.tradeKind)
    filter.tradeKind = req.query?.tradeKind || req.body?.tradeKind;
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
  console.log("getCardLogs filter: ", filter);
  return await CardLogModel.find(filter).sort({ transDate: -1 });
}
