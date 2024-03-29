import mongoose from "mongoose";
import { strToDate, fromAtDate, toAtDate } from "./date.js";
import { DefaultPersonalCategory, DefaultCorpCategory } from "../cmmCode.js";
import { KoreanFamilyName } from "../cmmCode.js";

export function assetFilter(req, fiterName = "") {
  if (!req?.body && !req?.query) return;
  const {
    _id,
    corpNum,
    userId,
    fromAt,
    toAt,
    category,
    finClassCode,
    finClassCodes,
    tradeCorp,
    employee,
    useKind,
    useYn,
    tradeKind,
  } = Object.keys(req.body).length > 0 ? req.body : req.query;

  const filter = {};

  if (_id) {
    filter._id = mongoose.Types.ObjectId(_id);
  }
  if (corpNum) {
    filter.corpNum = corpNum;
  }
  if (tradeKind) {
    filter.tradeKind = tradeKind;
  }
  if (category) {
    filter.category = category;
  }

  const codes = finClassCodes?.split("_");
  if (codes?.length > 0) {
    filter.finClassCode = { $in: codes };
  }
  if (finClassCode) {
    filter.finClassCode = finClassCode;
  }
  if (userId) filter.userId = userId;
  if (fromAt && toAt) {
    filter.transDate = {
      $gte: fromAtDate(fromAt),
      $lte: toAtDate(toAt),
    };
  }
  if (employee) {
    filter.employee = employee;
  }
  if (useKind) {
    filter.useKind = useKind;
  }
  if (useYn) {
    filter.useYn = useYn;
  }
  if (tradeCorp) {
    filter.tradeCorp = tradeCorp;
  }
  if (fiterName) console.log(`filter ${fiterName}: `, filter);
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

export function isKoreanName(word) {
  if (!word) return false;
  console.log(
    "KoreanFamilyName.includes(word[0]): ",
    word[0],
    KoreanFamilyName.includes(word[0])
  );
  return word?.length === 3 && KoreanFamilyName.includes(word[0]);
}
