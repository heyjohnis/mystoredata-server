import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import mongoose from "mongoose";
import {
  DefaultPersonalCategory,
  DefaultCorpCategory,
  FinClassCode,
} from "../cmmCode.js";
import { keywordCategory } from "../data/categoryData.js";
import { nowDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";

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
  // 카테고리 자동설정
  await autosetCategoryAndUseKind(resultAsset);
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

async function autosetCategoryAndUseKind(asset) {
  // 기 등록된 적요를 통해 카테고리 자동 설정
  const registedRemark = await registedRemarkForCategory(asset);
  if (registedRemark) {
    const { useKind, category, categoryName } = registedRemark;
    // 거래분류 (번것, 쓴것, 빌린것, 갚은것, 나머지)
    const { finClassCode, finClassName } = getFinClassCodeByCategory(category);
    await updateKeywordCategoryRule({
      asset,
      category,
      categoryName,
      useKind,
      finClassCode,
      finClassName,
    });
    console.log(
      `${nowDate()}: set category by remark: ${asset.transAssetNum} ${
        asset.transMoney
      } ${asset.transRemark} ${asset.useStoreName}`
    );
  } else {
    const DefaultCategory =
      asset.useKind === "BIZ" ? DefaultCorpCategory : DefaultPersonalCategory;
    const code = (await getAutosetCategoryCode(asset)) || "900";
    // 거래분류 (번것, 쓴것, 빌린것, 갚은것, 나머지)
    const { finClassCode, finClassName } = getFinClassCodeByCategory(code);
    await updateKeywordCategoryRule({
      asset,
      category: code,
      categoryName: DefaultCategory.find((cate) => cate.code === code).name,
      useKind: asset.useKind,
      finClassCode,
      finClassName,
    });
    console.log(
      `${nowDate()}: set category by keyword: ${asset.transAssetNum} ${
        asset.transMoney
      } ${asset.transRemark} ${asset.useStoreName}`
    );
  }
}

function getFinClassCodeByCategory(category) {
  const codes = [...DefaultPersonalCategory, ...DefaultCorpCategory];
  const finClassCode = codes.find((code) => code.code === category).finClass;
  return { finClassCode, finClassName: FinClassCode[finClassCode] };
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
  finClassCode,
  finClassName,
}) {
  await TransModel.updateOne(
    { _id: asset._id },
    {
      $set: {
        category,
        categoryName,
        useKind,
        finClassCode,
        finClassName,
      },
    }
  );
}

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

export async function updateTransMoney(req) {
  const _id = mongoose.Types.ObjectId(req.params.id);
  const { useKind, category, categoryName, useYn } = req.body;
  console.log({ _id, useKind, category, categoryName, useYn });
  return TransModel.updateOne(
    { _id },
    { $set: { useKind, category, categoryName, useYn } }
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
