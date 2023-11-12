import TransModel from "../model/transModel.js";
import UserModel from "../model/userModel.js";
import * as empData from "./empData.js";
import * as userData from "./userData.js";
import * as tradeCorpData from "./tradeCorpData.js";
import * as debtData from "./debtData.js";
import * as assetData from "./assetData.js";
import { FinClassCode, FinCardCorpKeyword } from "../cmmCode.js";
import {
  commmonCodeName,
  regexCorpName,
  isKoreanName,
} from "../utils/filter.js";
import debtModel from "../model/debtModel.js";
import assetModel from "../model/assetModel.js";
import { assetFilter } from "../utils/filter.js";
import { setDepositTransData } from "../utils/convert.js";

export async function updateFinClass(req) {
  const filter = assetFilter(req, "updateFinClass");
  filter.finClassCode = null;
  const items = await TransModel.find(filter);
  for (const item of items) {
    console.log("updateFinClass item: ", item.length);
    const finClassCode = await resultFinClassCode(item);
    await TransModel.findOneAndUpdate(
      { _id: item._id },
      { finClassCode: finClassCode, finClassName: FinClassCode[finClassCode] }
    );
  }
}

async function resultFinClassCode(log) {
  const inOut = log.transMoney > 0 ? "IN" : "OUT";
  // 사용자 회사명의 경우
  if (await isUserCorp(log)) return inOut + "3";
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
    return await defaultFinClassCode(log, inOut);
  }
  // 금융회사의 경우
  if (await isFinCorp(log)) return inOut + "2";
  // 정부기관의 경우
  if (await isGov(log)) return inOut + "1";
  // 부가세 납부의 경우
  if (await isVAT(log)) return inOut + "2";
  // 매출/매입의 경우(거래처명이 있는 경우) IN, OUT 이 바뀜
  if (await isTax(log)) return log.transMoney < 0 ? "IN2" : "OUT3";
  // 기타의 경우

  return inOut + "1";
}

async function isUserCorp(log) {
  console.log("isUserCorp: ", log.corpName, log.transRemark);
  for (const word of regexCorpName(`${log.transRemark}`).split(" ")) {
    if (log.corpName.indexOf(word) > -1) {
      // 보통예금으로 변경
      const transLog = setDepositTransData(log);
      await TransModel.updateOne(
        {
          _id: log._id,
        },
        {
          category: transLog.category,
          categoryName: transLog.categoryName,
          transMoney: log.transMoney * -1,
        }
      );
      return true;
    }
  }
  return false;
}

async function isCeoNameOrUserName(log) {
  console.log("isCeoNameOrUserName: ", log.transRemark, log.corpName);
  const myInfo = await UserModel.findOne({ _id: log.user });
  // 법인의 경우 해당 안됨
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
  const borrowInfo = await debtData.getDebtInfo(log);
  if (!borrowInfo) return false;
  await TransModel.updateOne(
    {
      _id: log._id,
    },
    {
      debt: borrowInfo._id,
      category: "480",
      categoryName: "차입금",
    }
  );
  return true;
}

async function isLoan(log) {
  const loanInfo = await assetData.getAssetInfo(log);
  if (!loanInfo) return false;
  await TransModel.updateOne(
    {
      _id: log._id,
    },
    {
      asset: loanInfo._id,
      category: "470",
      categoryName: "대여금",
      transMoney: log.transMoney * -1,
    }
  );
  return true;
}

async function isFinCorp(log) {
  // 1000 원 미만의 값은 제외
  if (Math.abs(log.transMoney) < 1000) return false;
  // 카드사의 경우
  if (FinCardCorpKeyword.includes(log.transRemark)) {
    await TransModel.updateOne(
      {
        _id: log._id,
      },
      {
        tradeKind: "CREDIT",
        category: "500",
        categoryName: "카드대금",
      }
    );
    return true;
  }
  return false;
}

async function isGov(log) {
  return false;
}

async function isVAT(log) {
  // 부가가치세
  const taxKeyword = "부가가치세";
  const transRemark = log?.transRemark || "";
  if (transRemark.indexOf(taxKeyword) > -1) {
    await TransModel.updateOne(
      {
        _id: log._id,
      },
      {
        category: "830",
        categoryName: "부가가치세",
      }
    );
    return true;
  }
  return false;
}

async function isTax(log) {
  const tradeCorpInfo = await tradeCorpData.getTradeCorpInfo(log);
  if (!tradeCorpInfo) return false;
  const accountLog = log._id;
  await TransModel.updateOne(
    {
      _id: accountLog,
    },
    {
      $set: {
        tradeCorp: tradeCorpInfo.tradeCorp,
        tradeCorpNum: tradeCorpInfo.tradeCorpNum,
        tradeCorpName: tradeCorpInfo.tradeCorpName,
        category: log.transMoney > 0 ? "550" : "540",
        categoryName: log.transMoney > 0 ? "매출채권" : "미지급금",
        transMoney: log.transMoney * -1,
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

async function defaultFinClassCode(log, inOut) {
  // 카드정보가 있으면 비용으로 간주
  console.log("defaultFinClassCode 카드정보: ", log.card);
  if (log.card) {
    return inOut + "1";
  }
  if (inOut == "IN") {
    try {
      const debtInfo = await new debtModel({
        user: log.user,
        userId: log.userId,
        corpNum: log.corpNum,
        corpName: log.corpName,
        finItemCode: "BORR",
        finItemName: "차입금",
        finName: log.transRemark,
        transRemark: log.transRemark,
      }).save();
      await TransModel.updateOne(
        {
          _id: log._id,
        },
        {
          category: "480",
          categoryName: "차입금",
          debt: debtInfo._id,
        }
      );
      return "IN2";
    } catch (error) {
      console.log("error: ", error);
    }
  } else {
    try {
      const assetInfo = await new assetModel({
        user: log.user,
        userId: log.userId,
        corpNum: log.corpNum,
        corpName: log.corpName,
        finItemCode: "LOAN",
        finItemName: "대여금",
        finName: log.transRemark,
        transRemark: log.transRemark,
      }).save();
      await TransModel.updateOne(
        {
          _id: log._id,
        },
        {
          category: "470",
          categoryName: "대여금",
          asset: assetInfo._id,
        }
      );
      return "OUT3";
    } catch (error) {
      console.log("error: ", error);
    }
  }
}
