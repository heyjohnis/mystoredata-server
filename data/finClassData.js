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
  const finClassCode = await resultFinClassCode(log);
  console.log("finClassCode: ", finClassCode);
  await TransModel.findOneAndUpdate(
    { _id: log._id },
    { finClassCode: finClassCode, finClassName: FinClassCode[finClassCode] }
  );
  // 내 상점 기초정보에 해당되는 거래에 대해 자동분류

  //const isMyInfo = await resultFinCodeByMyStoreBasicInfo(log);
  // if (isMyInfo) return isMyInfo;
  // return finClassCode;
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

// 내 상점 기본정보에 해당되는 거래에 대해 자동분류
export async function resultFinCodeByMyStoreBasicInfo(log) {
  const myInfo = await UserModel.findOne({ _id: log.user });
  const corpName = regexCorpName(myInfo.corpName || " ");
  const userName = myInfo.userName || " ";
  const ceoName = myInfo.ceoName || " ";
  console.log("myInfo: ", corpName, userName, ceoName);
  let isIncluded = false;
  for (const word of regexCorpName(`${log.transRemark}`).split(" ")) {
    const corpType = myInfo.corpType || "";
    // 법인의 경우에는 법인명만 해당됨(대표자명, 상호명은 해당안됨)
    if (corpType === "C") {
      isIncluded += [corpName].includes(word);
    } else {
      isIncluded += [corpName, userName, ceoName].includes(word);
    }
  }
  if (!isIncluded) return false;
  const finClassCode = log.transMoney > 0 ? "IN3" : "OUT3";
  console.log("나의 기초정보에 해당되는 거래: ", log.transRemark, finClassCode);
  return await TransModel.findOneAndUpdate(
    { _id: log._id },
    {
      $set: {
        finClassCode,
        finClassName: FinClassCode[finClassCode],
        category: "300",
        categoryName: commmonCodeName("300"),
      },
    }
  );
}

// 세금계산서 발행내역에 해당되는 거래에 대해 자동분류
// export async function resultFinClassCode(log) {
//   let finClassCode = log.transMoney > 0 ? "IN" : "OUT";
//   // 세금계산서 발행내역에 해당되는 거래에 대해 자동분류
//   const isTax = await taxLogData.isTaxRecipt(log);
//   finClassCode += isTax ? "1" : isKoreanName(log.transRemark) ? "2" : "3";
//   const { category, categoryName } = await setCategory(finClassCode, log);

//   return await TransModel.findOneAndUpdate(
//     { _id: log._id },
//     {
//       $set: {
//         finClassCode,
//         finClassName: FinClassCode[finClassCode],
//         category,
//         categoryName,
//       },
//     }
//   );
// }

async function setCategory(code, log) {
  let category = "";
  let categoryName = "";
  switch (code) {
    case "IN1":
      category = "400";
      categoryName = commmonCodeName("400");
      break;
    case "OUT1":
      category = "410";
      categoryName = commmonCodeName("410");
      break;
    default:
      const myInfo = await UserModel.findOne({ _id: log.user });
      const userCates = myInfo.userCategory;
      // 등록된 카테고리가 하나도 없는 경우
      if (userCates && userCates?.length === 0) {
        category = "1000";
        await createCategory({
          user: log.user,
          code: category,
          name: log.transRemark || log.useStoreName || log.transOffice,
          finClass: code,
        });
      } else {
        const userCate = userCates.find(
          (c) =>
            c.name === (log.transRemark || log.useStoreName || log.transOffice)
        );
        if (userCate) {
          category = userCate.code;
          categoryName = userCate.name;
        } else {
          const maxCode = userCates.reduce((acc, cur) => {
            return acc > parseInt(cur.code) ? acc : parseInt(cur.code);
          }, 0);
          category = maxCode + 1 + "";
          categoryName = log.transRemark || log.useStoreName || log.transOffice;
          await createCategory({
            user: log.user,
            code: category,
            name: categoryName,
            finClass: code,
          });
        }
      }
  }
  return { category, categoryName };
}

async function createCategory({ user, code, name, finClass }) {
  await UserModel.updateOne(
    { _id: user },
    {
      $push: {
        userCategory: {
          code,
          name,
          finClass,
        },
      },
    }
  );
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
