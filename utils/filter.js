import { strToDate } from "./date.js";

export function assetFilter(req) {
  const { corpNum, userId, fromAt, toAt } =
    Object.keys(req.body).length > 0 ? req.body : req.query;
  const filter = {};
  if (corpNum) {
    filter.corpNum = corpNum;
  }
  if (userId) filter.userId = userId;
  if (strToDate(fromAt) && strToDate(toAt)) {
    filter.transDate = {
      $gte: strToDate(fromAt),
      $lte: strToDate(toAt),
    };
  }
  return filter;
}
