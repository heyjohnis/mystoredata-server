import TransModel from "../model/transModel.js";
import UserModel from "../model/userModel.js";
import * as empData from "./empData.js";
import * as userData from "./userData.js";
import * as tradeCorpData from "./tradeCorpData.js";
import * as debtData from "./debtData.js";
import * as assetData from "./assetData.js";
import {
  FinClassCode,
  FinCardCorpKeyword,
  CardTypeKeword,
} from "../cmmCode.js";
import { regexCorpName, isKoreanName } from "../utils/filter.js";
import debtModel from "../model/debtModel.js";
import assetModel from "../model/assetModel.js";
import { assetFilter } from "../utils/filter.js";
import { setDepositTransData } from "../utils/convert.js";

// 거래분류가 없는 거래에 대해 거래분류를 업데이트
export async function updateFinClass(req) {
  const filter = assetFilter(req, "updateFinClass");
  filter.finClassCode = null;
  const items = await TransModel.find(filter);
  for (const item of items) {
    await resultFinClassCode(item);
  }
}

async function resultFinClassCode(log) {
  const inOut = log.tradeType === "C" ? "IN" : "OUT"; // 입금, 출금
  if (await isCardTrans(log, inOut)) return;
  // 사용자 회사명의 경우
  if (await isUserCorp(log)) return;
  // 한국사람 이름인 경우
  if (isKoreanName(log.transRemark)) {
    // 개인사업자의 경우 대표자나 사용자 이름인 경우
    if (await isCeoNameOrUserName(log)) return;
    // 직원명이 경우
    if (await hasEmployee(log)) return;
    // 차입금의 경우
    if (await isBorrow(log)) return;
    // 대여금의 경우
    if (await isLoan(log)) return;
    // 미분류의 경우
    defaultFinClassCode(log, inOut);
    return;
  }
  // 금융회사의 경우
  if (await isFinCorp(log)) return;
  // 정부기관의 경우
  if (await isGov(log)) return;
  // 부가세 납부의 경우
  if (await isVAT(log)) return;
  // 매출/매입의 경우(거래처명이 있는 경우) IN, OUT 이 바뀜
  if (await isTax(log)) return;
  // 기타의 경우
  console.log("기타의 경우: ", log.transRemark, log.transMoney);
  await TransModel.updateOne(
    { _id: log._id },
    { finClassCode: inOut + 1, finClassName: FinClassCode[inOut + 1] }
  );
}

async function isCardTrans(log, inOut) {
  if (!CardTypeKeword.includes(log?.transType || " ")) return false;

  await TransModel.updateOne(
    { _id: log._id },
    {
      finClassCode: "OUT1",
      finClassName: FinClassCode["OUT1"],
      transMoney: inOut === "IN" ? log.transMoney * -1 : log.transMoney,
    }
  );
  return true;
}

async function isUserCorp(log) {
  if (!log.transRemark) return false;
  for (const word of regexCorpName(`${log.transRemark}`).split(" ")) {
    if (log.corpName.indexOf(word) > -1) {
      // 보통예금으로 변경
      const transLog = setDepositTransData(log);
      const {
        tradeType,
        category,
        categoryName,
        transMoney,
        finClassCode,
        finClassName,
      } = transLog;
      await TransModel.updateOne(
        {
          _id: log._id,
        },
        {
          tradeType,
          category,
          categoryName,
          transMoney,
          finClassCode,
          finClassName,
        }
      );
      console.log("isUserCorp: ", log.transRemark, log.transMoney);
      return true;
    }
  }
  return false;
}

async function isCeoNameOrUserName(log) {
  const myInfo = await UserModel.findOne({ _id: log.user });
  // 법인의 경우 해당 안됨
  if (!log?.transRemark) return false;
  if (myInfo.corpType === "C") return false;

  const userName = myInfo.userName || "     ";
  const ceoName = myInfo.ceoName || "     ";

  if (
    log.transRemark.indexOf(userName) > -1 ||
    log.transRemark.indexOf(ceoName) > -1
  ) {
    await TransModel.updateOne(
      {
        _id: log._id,
      },
      {
        finClassCode: log.tradeType === "C" ? "OUT3" : "IN3",
        finClassName: log.tradeType === "C" ? "나머지(자산-)" : "나머지(자산+)",
      }
    );
    console.log("isCeoNameOrUserName: ", log.transRemark, log.transMoney);
    return true;
  } else {
    return false;
  }
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
      finClassCode: "OUT1",
      finClassName: "쓴것(비용+)",
    }
  );
  console.log("hasEmployee: ", log.transRemark, log.transMoney);
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
      finClassCode: log.tradeType === "C" ? "IN2" : "OUT2",
      finClassName: log.tradeType === "C" ? "빌린것(부채+)" : "빌린것(부채-)",
    }
  );
  console.log("isBorrow: ", log.transRemark, log.transMoney);
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
      finClassCode: log.tradeType === "D" ? "IN3" : "OUT3",
      finClassName: log.tradeType === "D" ? "나머지(자산+)" : "나머지(자산-)",
      transMoney: log.transMoney,
    }
  );
  console.log("isLoan: ", log.transRemark, log.transMoney);
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
        finClassCode: log.tradeType === "C" ? "IN2" : "OUT2",
        finClassName: log.tradeType === "C" ? "빌린것(부채+)" : "빌린것(부채-)",
      }
    );
    console.log("isFinCorp: ", log.transRemark, log.transMoney);
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
        finClassCode: log.tradeType === "C" ? "IN2" : "OUT2",
        finClassName: log.tradeType === "C" ? "빌린것(부채+)" : "빌린것(부채-)",
      }
    );
    return true;
  }
  console.log("isVAT: ", log.transRemark, log.transMoney);
  return false;
}

async function isTax(log) {
  const tradeCorpInfo = await tradeCorpData.getTradeCorpInfo(log);
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
        category: log.tradeType === "C" ? "550" : "540",
        categoryName: log.tradeType === "C" ? "매출채권" : "미지급금",
        finClassCode: log.tradeType === "C" ? "OUT3" : "IN3",
        finClassName: log.tradeType === "C" ? "나머지(자산-)" : "나머지(자산+)",
      },
    }
  );
  console.log("isTax: ", log.transRemark, log.transMoney);
  return true;
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
  // 입금의 경우
  if (inOut === "IN") {
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
          tradeType: "C",
          finClassCode: "IN2",
          finClassName: "빌린것(부채+)",
        }
      );
    } catch (error) {
      console.log("error: ", error);
    }
  }
  // 출금의 경우
  else {
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
          tradeType: "D",
          finClassCode: "IN3",
          finClassName: "나머지(자산+)",
        }
      );
    } catch (error) {
      console.log("error: ", error);
    }
  }
}
