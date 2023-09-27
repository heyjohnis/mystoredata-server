import TransModel from "../model/transModel.js";
import UserModel from "../model/userModel.js";
import * as taxLogData from "./taxLogData.js";
import { FinClassCode, KoreanFamilyName } from "../cmmCode.js";
import { commmonCodeName, regexCorpName } from "../utils/filter.js";

export async function updateFinClass(log) {
  // 내 상점 기초정보에 해당되는 거래에 대해 자동분류
  const isMyInfo = await resultFinCodeByMyStoreBasicInfo(log);
  if (isMyInfo) return isMyInfo;
  // 세금계산서 발행내역에 해당되는 거래에 대해 자동분류
  const isTax = await resultFinClassCode(log);
  return isTax;
}

// 내 상점 기보정보에 해당되는 거래에 대해 자동분류
export async function resultFinCodeByMyStoreBasicInfo(log) {
  const myInfo = await UserModel.findOne({ _id: log.user });
  const corpName = regexCorpName(myInfo.corpName || " ");
  const userName = myInfo.userName || " ";
  const ceoName = myInfo.ceoName || " ";
  console.log("myInfo: ", corpName, userName, ceoName);
  let isIncluded = false;
  for (const word of regexCorpName(`${log.transRemark}`).split(" ")) {
    isIncluded += [corpName, userName, ceoName].includes(word);
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
export async function resultFinClassCode(log) {
  let finClassCode = log.transMoney > 0 ? "IN" : "OUT";
  // 세금계산서 발행내역에 해당되는 거래에 대해 자동분류
  const isTax = await taxLogData.isTaxRecipt(log);
  finClassCode += isTax ? "1" : isHumanName(log.transRemark) ? "2" : "3";
  const { category, categoryName } = await setCategory(finClassCode, log);

  return await TransModel.findOneAndUpdate(
    { _id: log._id },
    {
      $set: {
        finClassCode,
        finClassName: FinClassCode[finClassCode],
        category,
        categoryName,
      },
    }
  );
}

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
          name: log.transRemark || log.useStoreName,
          finClass: code,
        });
      } else {
        const userCate = userCates.find(
          (c) => c.name === (log.transRemark || log.useStoreName)
        );
        if (userCate) {
          category = userCate.code;
          categoryName = userCate.name;
        } else {
          const maxCode = userCates.reduce((acc, cur) => {
            return acc > parseInt(cur.code) ? acc : parseInt(cur.code);
          }, 0);
          category = maxCode + 1 + "";
          categoryName = log.transRemark || log.useStoreName;
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

// 사람 이름인지 확인
function isHumanName(word) {
  if (!word) return false;
  console.log(
    "KoreanFamilyName.includes(word[0]): ",
    word[0],
    KoreanFamilyName.includes(word[0])
  );
  return word?.length === 3 && KoreanFamilyName.includes(word[0]);
}
