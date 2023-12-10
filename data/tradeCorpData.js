import TaxLogModel from "../model/taxLogModel.js";
import TradeCorpModel from "../model/tradeCorpModel.js";
import { strToDate } from "../utils/date.js";
import { assetFilter, regexCorpName } from "../utils/filter.js";
import { calculateSimilarity } from "../utils/similarity.js";

export async function getTradeCorpList(data) {
  const filter = assetFilter(data);
  return await TradeCorpModel.find(filter).sort({ tradeCorpName: 1 });
}

export async function getTradeCorpInfo(data) {
  const { transRemark, userId } = data;
  const corpName = regexCorpName(transRemark);
  const tradeCorps = await TradeCorpModel.find({ userId });
  const bestSimilar = {
    tradeCorpName: "",
    similarity: 0,
    tradeCorp: null,
    tradeCorpNum: null,
  };
  for (const tradeCorp of tradeCorps) {
    const simiar = calculateSimilarity(
      regexCorpName(tradeCorp.tradeCorpName),
      corpName
    );
    if (simiar > bestSimilar.similarity) {
      bestSimilar.tradeCorp = tradeCorp._id;
      bestSimilar.tradeCorpName = tradeCorp.tradeCorpName;
      bestSimilar.similarity = simiar;
    }
  }
  console.log("bestSimilar: ", bestSimilar);
  return bestSimilar.similarity > 0.5 ? bestSimilar : null;
}
