import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import mongoose from "mongoose";
import { DefaultCategory } from "../cmmCode.js";
import { keywordCategory } from "../data/categoryData.js";
import { nowDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";

export async function mergeTransMoney(log) {
  const asset = convertTransAsset(log);
  console.log(" mergeTransMoney asset: ", asset);
  const query = {};
  query.corpNum = asset.corpNum;
  query.transMoney = asset.transMoney;
  query.transDate = {
    $gte: new Date(Number(asset.transDate) - 100000),
    $lte: new Date(Number(asset.transDate) + 100000),
  };
  query.$or = [];
  if (asset?.bankAccountNum) {
    query.$or.push({ account: asset.account });
    query.$or.push({
      $and: [{ account: { $ne: asset.account } }, { card: { $ne: null } }],
    });
  }
  if (asset?.cardNum) {
    query.$or.push({ card: asset.card });
    query.$or.push({
      $and: [{ card: { $ne: asset.card } }, { account: { $ne: null } }],
    });
  }
  console.log("query: ", query);
  const duplAsset = await TransModel.findOne(query);
  console.log("duplAsset: ", duplAsset);
  let resultAsset = {};
  if (duplAsset) {
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
      return;
    }
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

async function autosetCategoryAndUseKind(asset) {
  // 기 등록된 적요를 통해 카테고리 자동 설정
  const registedRemark = await registedRemarkForCategory(asset);

  if (registedRemark) {
    await updateKeywordCategoryRule({
      asset,
      category: registedRemark.category,
      categoryName: registedRemark.categoryName,
      useKind: registedRemark.useKind,
    });
    console.log(
      `${nowDate()}: set category by remark: ${asset.transAssetNum} ${
        asset.transMoney
      } ${asset.transRemark} ${asset.useStoreName}`
    );
  } else {
    const code = await getAutosetCategoryCode(asset);
    if (!code) return;
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
  const query = { user: asset.user, $or: [] };
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
  const cardData = {
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
  };

  const accountData = {
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
  };

  return asset.cardNum ? cardData : accountData;
}
