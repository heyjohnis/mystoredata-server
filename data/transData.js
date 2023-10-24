import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import DebtModel from "../model/debtModel.js";
import mongoose from "mongoose";
import {
  DefaultPersonalCategory,
  DefaultCorpCategory,
  FinClassCode,
} from "../cmmCode.js";
import { keywordCategory } from "../data/categoryData.js";
import { nowDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";
import { getFinClassByCategory, updateFinClass } from "./finClassData.js";

export async function mergeTransMoney(log) {
  const asset = convertTransAsset(log);
  // 중복 거래 확인(카드만 등록, 계좌만 등록, 기 등록된 거래인지?)
  const duplAsset = await extractDuplAsset(asset);
  let resultAsset = {};
  if (duplAsset) {
    // 기 등록된 거래는 skip
    if (isRegistedTrans(asset, duplAsset)) return;

    asset.keyword = Array.from(
      new Set([...(asset.keyword || []), ...(duplAsset.keyword || [])])
    );
    resultAsset = await TransModel.findOneAndUpdate(
      { _id: duplAsset._id },
      { $set: asset },
      { new: true }
    );
    console.log(
      `${nowDate()}: trans asset updated: ${resultAsset.transAssetNum} ${
        resultAsset.transMoney
      } ${resultAsset.transRemark} ${resultAsset.useStoreName}`
    );
  } else {
    console.log("create log");
    resultAsset = await new TransModel(asset).save();
    console.log(
      `${nowDate()}: trans asset created: ${resultAsset.transAssetNum} ${
        resultAsset.transMoney
      } ${resultAsset.transRemark} ${resultAsset.useStoreName}`
    );
  }
}

function isRegistedTrans(asset, duplAsset) {
  let isRegisted = false;
  if (
    (duplAsset.card && duplAsset.card === asset.card) ||
    (duplAsset.account && duplAsset.account === asset.account)
  ) {
    console.log(
      `${nowDate()}: 기등록한 거래: ${asset.transAssetNum} ${
        asset.transMoney
      } ${asset.transRemark} ${asset.useStoreName}`
    );
    console.log("신규거래: ", new Date(Number(asset.transDate)));
    console.log("기등록거래: ", new Date(Number(duplAsset.transDate)));
    isRegisted = true;
  }

  return isRegisted;
}

async function extractDuplAsset(asset) {
  const query = {};
  query.corpNum = asset.corpNum;
  query.transMoney = asset.transMoney;
  query.transDate = {
    $gte: new Date(Number(asset.transDate) - 200000),
    $lte: new Date(Number(asset.transDate) + 200000),
  };
  query.$or = [];
  if (asset?.bankAccountNum) {
    query.$or.push({ accountLog: asset.accountLog });
    query.$or.push({
      $and: [
        { accountLog: { $ne: asset.accountLog } },
        { cardLog: { $ne: null } },
      ],
    });
  }
  if (asset?.cardNum) {
    query.$or.push({ cardLog: asset.cardLog });
    query.$or.push({
      $and: [
        { cardLog: { $ne: asset.cardLog } },
        { accountLog: { $ne: null } },
      ],
    });
  }
  return await TransModel.findOne(query);
}

export async function autoSetCategoryAndUseKind(asset) {
  // 기 등록된 적요를 통해 카테고리 자동 설정
  const registedRemark = await registedRemarkForCategory(asset);
  if (registedRemark) {
    const { useKind, category, categoryName } = registedRemark;
    await updateKeywordCategoryRule({
      asset,
      category,
      categoryName,
      useKind,
    });
    console.log(
      `${nowDate()}: set category by remark: ${asset.transAssetNum} ${
        asset.transMoney
      } ${asset.transRemark} ${asset.useStoreName}`
    );
  } else {
    const DefaultCategory =
      asset.useKind === "BIZ" ? DefaultCorpCategory : DefaultPersonalCategory;

    // 키워드 및 형태소 분석을 통해 카테고리 자동 설정
    const code = (await getAutosetCategoryCode(asset)) || "999";
    await updateKeywordCategoryRule({
      asset,
      category: code,
      categoryName: DefaultCategory.find((cate) => cate.code === code).name,
      useKind: asset.useKind,
    });
    console.log(
      `${nowDate()}: set category by keyword: ${asset.transAssetNum} ${
        asset.transMoney
      } ${asset.transRemark} ${asset.useStoreName}`
    );
  }
}

async function registedRemarkForCategory(asset) {
  const query = { user: asset.user, useKind: asset.useKind, $or: [] };
  const { useStoreName, transRemark } = asset;
  if (asset.useStoreName) query.$or.push({ useStoreName });
  if (asset.transRemark) query.$or.push({ transRemark });
  if (query.$or.length === 0) return;
  return await CategoryRuleModel.findOne(query);
}

async function updateKeywordCategoryRule({
  asset,
  category,
  categoryName,
  useKind,
}) {
  await TransModel.updateOne(
    { _id: asset._id },
    {
      $set: {
        category,
        categoryName,
        useKind,
      },
    }
  );
}

// 키워드 및 형태소 분석을 통해 카테고리 자동 설정
async function getAutosetCategoryCode(asset) {
  const cateObj = await keywordCategory(asset);
  let code = "";
  // 형태소 분석을 통한 카테고리 자동 설정
  asset.keyword.forEach((keyword) => {
    if (cateObj[keyword]) {
      code = cateObj[keyword];
    }
  });

  if (!code) {
    // 적요, 상점명, 업태의 내용에 키워드 포함 여부를 통한 카테고리 자동 설정s
    const words = `${asset.transRemark} ${asset.useStoreName} ${asset.useStoreBizType}`;
    Object.keys(cateObj).forEach((key) => {
      if (words.includes(key)) {
        code = cateObj[key];
      }
    });
  }
  return code;
}

export async function getTransMoney(req) {
  const filter = assetFilter(req);
  console.log({ filter });
  return TransModel.find(filter).sort({ transDate: -1 });
}

export async function getTradeLogs(req) {
  const { userId, tradeCorp } = req.body;
  console.log("tradeCorp: ", tradeCorp);
  if (!tradeCorp) return;
  return TransModel.find({
    userId,
    tradeCorp: mongoose.Types.ObjectId(tradeCorp),
  });
}

export async function getEmployeeLogs(req) {
  const { userId, employee } = req.body;
  console.log("employee: ", employee);
  if (!employee) return;
  return TransModel.find({
    userId,
    employee: mongoose.Types.ObjectId(employee),
  });
}

export async function getDebtLogs(req) {
  const { userId, debt } = req.body;
  console.log("debt: ", debt);
  if (!debt) return;
  return TransModel.find({
    userId,
    debt: mongoose.Types.ObjectId(debt),
  });
}

export async function getAssetLogs(req) {
  const { userId, asset } = req.body;
  console.log("asset: ", asset);
  if (!asset) return;
  return TransModel.find({
    userId,
    asset: mongoose.Types.ObjectId(asset),
  });
}

export async function updateTransMoney(req) {
  const _id = mongoose.Types.ObjectId(req.params.id);
  const { user, useKind, category, categoryName, useYn } = req.body;
  const { finClassCode, finClassName } = await getFinClassByCategory(req);
  return TransModel.updateOne(
    { _id },
    {
      $set: {
        useKind,
        category,
        categoryName,
        useYn,
        finClassCode,
        finClassName,
      },
    }
  );
}

export async function updateCategory(req) {
  const { userId, category, changeCategory } = req.body;
  const { finClassCode, finClassName } = await getFinClassByCategory(req);
  return TransModel.updateMany(
    {
      userId,
      category,
    },
    { $set: { category: changeCategory, finClassCode, finClassName } }
  );
}

function convertTransAsset(asset) {
  const isCanceled = ["취소", "거절"].includes(asset.cardApprovalType);
  const cardData = {
    cardLog: asset._id,
    user: asset.user,
    userId: asset.userId,
    corpNum: asset.corpNum,
    corpName: asset.corpName,
    card: asset.card,
    cardCompany: asset.cardCompany,
    cardNum: asset.cardNum,
    cardType: asset.cardType,
    payType: asset.payType,
    useKind: asset.useKind,
    useDT: asset.useDT,
    transDate: asset.transDate,
    transMoney: asset.transMoney,
    transAssetNum: asset.transAssetNum,
    cardApprovalType: asset.cardApprovalType,
    cardApprovalNum: asset.cardApprovalNum,
    cardApprovalCost: asset.cardApprovalCost,
    amount: asset.amount,
    tax: asset.tax,
    serviceCharge: asset.serviceCharge,
    totalAmount: asset.totalAmount,
    useStoreNum: asset.useStoreNum,
    useStoreCorpNum: asset.useStoreCorpNum,
    useStoreName: asset.useStoreName,
    useStoreAddr: asset.useStoreAddr,
    useStoreBizType: asset.useStoreBizType,
    useStoreTel: asset.useStoreTel,
    useStoreTaxType: asset.useStoreTaxType,
    paymentPlan: asset.paymentPlan,
    installmentMonths: asset.installmentMonths,
    currency: asset.currency,
    keyword: asset.keyword,
    useYn: !isCanceled,
  };

  const accountData = {
    accountLog: asset._id,
    user: asset.user,
    userId: asset.userId,
    useKind: asset.useKind,
    bank: asset.bank,
    corpNum: asset.corpNum,
    corpName: asset.corpName,
    bankAccountNum: asset.bankAccountNum,
    account: asset.account,
    withdraw: asset.withdraw,
    deposit: asset.deposit,
    balance: asset.balance,
    transDT: asset.transDT,
    transDate: asset.transDate,
    transMoney: asset.transMoney,
    transAssetNum: asset.transAssetNum,
    transType: asset.transType,
    transOffice: asset.transOffice,
    transRemark: asset.transRemark,
    transRefKey: asset.transRefKey,
    mgtRemark1: asset.mgtRemark1,
    mgtRemark2: asset.mgtRemark2,
    keyword: asset.keyword,
    useYn: !isCanceled,
  };

  return asset.cardNum ? cardData : accountData;
}

export async function upateCancelLog(req) {
  try {
    const _id = mongoose.Types.ObjectId(req._id);
    await TransModel.updateOne({ _id }, { $set: { useYn: false } });
    const canceledLogs = await TransModel.findOneAndUpdate(
      {
        userId: req.userId,
        transDate: { $lte: req.transDate },
        transMoney: req.transMoney * -1,
      },
      { $set: { useYn: false } },
      { sort: { transDate: -1 } }
    );
    console.log("canceledLogs: ", canceledLogs);
    if (!canceledLogs) {
      const canceledLogsInverse = await TransModel.findOneAndUpdate(
        {
          userId: req.userId,
          transDate: { $gte: req.transDate },
          transMoney: req.transMoney * -1,
        },
        { $set: { useYn: false } }
      );
    }
    return { success: true };
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function updateTransMoneyForEmployee(req, data) {
  return await TransModel.updateMany(
    { userId: req.body.userId, transRemark: req.body.transRemark },
    {
      $set: {
        employee: data._id,
        category: "630",
        categoryName: "급여",
        finClassCode: "OUT1",
        finClassName: "쓴것(비용+)",
      },
    }
  ).then((result) => result);
}

export async function updateTransMoneyForDebt(req, data) {
  const { userId, transRemark, finClassName, finItemCode } = req.body;
  const category = finItemCode === "BORR" ? "480" : "";
  const categoryName = finItemCode === "BORR" ? "차입금" : "";

  // 입금의 경우
  const updated = await TransModel.updateMany(
    { userId, transRemark, transMoney: { $gt: 0 } },
    {
      $set: {
        debt: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "BORR" ? "IN2" : "",
        finClassName: finItemCode === "BORR" ? "빌린것(부채+)" : "",
      },
    }
  );
  // 출금의 경우
  const updated2 = await TransModel.updateMany(
    { userId, transRemark, transMoney: { $lt: 0 } },
    {
      $set: {
        debt: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "BORR" ? "OUT2" : "",
        finClassName: finItemCode === "BORR" ? "갚은것(부채-)" : "",
      },
    }
  );

  return { ...updated, ...updated2 };
}

export async function updateTransMoneyForAsset(req, data) {
  const { userId, transRemark, finItemCode } = req.body;
  const category = finItemCode === "LOAN" ? "470" : "";
  const categoryName = finItemCode === "LOAN" ? "대여금" : "";

  // 입금의 경우
  const updated = await TransModel.updateMany(
    { userId, transRemark, transMoney: { $gt: 0 } },
    {
      $set: {
        asset: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "LOAN" ? "IN3" : "",
        finClassName: finItemCode === "LOAN" ? "나머지(자산-)" : "",
      },
    }
  );
  // 출금의 경우
  const updated2 = await TransModel.updateMany(
    { userId, transRemark, transMoney: { $lt: 0 } },
    {
      $set: {
        asset: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "LOAN" ? "OUT3" : "",
        finClassName: finItemCode === "LOAN" ? "나머지(자산+)" : "",
      },
    }
  );

  return { ...updated, ...updated2 };
}

export async function getNoneCategoryTransMoney(req, cateCd) {
  const filter = assetFilter(req);
  filter.category = cateCd;
  console.log("getNonCategoryTransMoney: ", filter);
  return TransModel.find(filter).sort({ transDate: -1 });
}

export async function updateCategoryNoneCategory(log, categorySet) {
  const { category, categoryName } = categorySet;
  await TransModel.updateOne(
    { _id: log._id },
    {
      $set: {
        category,
        categoryName,
      },
    }
  );
}
