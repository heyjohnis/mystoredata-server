import { strToDate, fromAtDate, toAtDate } from "./date.js";

export function assetFilter(req) {
  if (!req?.body && !req?.query) return;
  const { corpNum, userId, fromAt, toAt } =
    Object.keys(req.body).length > 0 ? req.body : req.query;
  const filter = {};
  if (corpNum) {
    filter.corpNum = corpNum;
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
