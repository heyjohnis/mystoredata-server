import TransModel from "../model/transModel.js";
import UserModel from "../model/userModel.js";
import * as empData from "./empData.js";
import * as userData from "./userData.js";
import * as tradeCorpData from "./tradeCorpData.js";
import { FinClassCode } from "../cmmCode.js";
import {
  commmonCodeName,
  regexCorpName,
  isKoreanName,
} from "../utils/filter.js";

export async function updateFinClass(log) {
  // 거래분류 업데이트
  const finClassCode = await resultFinClassCode(log);
  console.log("finClassCode: ", finClassCode);
  await TransModel.findOneAndUpdate(
    { _id: log._id },
    { finClassCode: finClassCode, finClassName: FinClassCode[finClassCode] }
  );
}

async function resultFinClassCode(log) {
  const inOut = log.transMoney > 0 ? "IN" : "OUT";
  // 사용자 회사명의 경우
  if (isUserCorp(log)) return inOut + "3";
  // 한국사람 이름인 경우
  if (isKoreanName(log.transRemark)) {
    // 개인사업자의 경우 대표자나 사용자 이름인 경우
    if (await isCeoNameOrUserName(log)) return inOut + "3";
    // 직원명이 경우
    if (await hasEmployee(log)) return inOut + "1";
    // 차입금의 경우
    if (await isBorrow(log)) return inOut + "2";
    // 대여금의 경우
    if (await isLoan(log)) return inOut + "3";
    // 미분류의 경우
    return inOut + "4";
  }
  // 금융회사의 경우
  if (await isFinCorp(log)) return inOut + "2";
  // 정부기관의 경우
  if (await isGov(log)) return inOut + "1";
  // 매출/매입의 경우
  if (await isTax(log)) return inOut + "1";
  // 기타의 경우
  return inOut + "3";
}

function isUserCorp(log) {
  console.log("isUserCorp: ", log.corpName, log.transRemark);
  for (const word of regexCorpName(`${log.transRemark}`).split(" ")) {
    if (log.corpName.indexOf(word) > -1) return true;
  }
  return false;
}

async function isCeoNameOrUserName(log) {
  console.log("isCeoNameOrUserName: ", log.transRemark, log.corpName);
  const myInfo = await UserModel.findOne({ _id: log.user });
  // 법인의 경우 해당 안됨gghl
  if (!log?.transRemark) return false;
  if (myInfo.corpType === "C") return false;

  const userName = myInfo.userName || "     ";
  const ceoName = myInfo.ceoName || "     ";

  return (
    log.transRemark.indexOf(userName) > -1 ||
    log.transRemark.indexOf(ceoName) > -1
  );
}

async function hasEmployee(log) {
  const employeeInfo = await empData.getEmployeeInfo(log);
  if (!employeeInfo) return false;

  await TransModel.updateOne(
    {
      _id: log._id,
    },
    {
      employee: employeeInfo._id,
      category: "630",
      categoryName: "급여",
    }
  );
  return true;
}

async function isBorrow(log) {
  return false;
}

async function isLoan(log) {
  return false;
}

async function isFinCorp(log) {
  return false;
}

async function isGov(log) {
  return false;
}

async function isTax(log) {
  const tradeCorpInfo = await tradeCorpData.getTradeCorpInfo(log);
  console.log("tradeCorpInfo: ", tradeCorpInfo, log.transRemark);
  if (!tradeCorpInfo) return false;
  await TransModel.updateOne(
    {
      _id: log._id,
    },
    {
      $set: {
        tradeCorp: tradeCorpInfo.tradeCorp,
        tradeCorpNum: tradeCorpInfo.tradeCorpNum,
        tradeCorpName: tradeCorpInfo.tradeCorpName,
      },
    }
  );
  return tradeCorpInfo !== null;
}

export async function getFinClassByCategory(req) {
  const category = req.body.changeCategory || req.body.category;
  const categories = await userData.getUserCategory(req);
  const allCate = [
    ...categories.corpCategory,
    ...categories.personalCategory,
    ...categories.userCategory,
  ];
  const selectedCategory = allCate.find((cate) => cate.code === category);
  return {
    finClassCode: selectedCategory.finClass || "",
    finClassName: FinClassCode[selectedCategory.finClass] || "",
  };
}
