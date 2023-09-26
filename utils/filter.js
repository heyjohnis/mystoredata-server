import { strToDate, fromAtDate, toAtDate } from "./date.js";
import { DefaultPersonalCategory, DefaultCorpCategory } from "../cmmCode.js";
export function assetFilter(req) {
  if (!req?.body && !req?.query) return;
  const { corpNum, userId, fromAt, toAt, category } =
    Object.keys(req.body).length > 0 ? req.body : req.query;
  const filter = {};
  if (corpNum) {
    filter.corpNum = corpNum;
  }
  if (category) {
    filter.category = category;
  }
  if (userId) filter.userId = userId;
  if (fromAt && toAt) {
    filter.transDate = {
      $gte: fromAtDate(fromAt),
      $lte: toAtDate(toAt),
    };
  }
  return filter;
}

export function regexCorpName(word) {
  if (!word) return "";
  const regex = /주식회사|\(주\)|\(주|주\)/gi;
  return word.replace(regex, "").trim();
}

export function commmonCodeName(code) {
  const codes = [...DefaultPersonalCategory, ...DefaultCorpCategory];
  return codes.find((c) => c.code === code)?.name || "";
}
