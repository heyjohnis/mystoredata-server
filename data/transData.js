import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import mongoose from "mongoose";
import { defaultCategory } from "../cmmCode.js";
import { keywordCategory } from "../data/categoryData.js";

export async function mergeTransMoney(asset) {
  const transAsset = setTransAsset(asset);

  const assets = await TransModel.find({
    corpNum: transAsset.corpNum,
    transMoney: transAsset.transMoney,
  });
  const duplAsset = assets.find(
    (regAsset) => Math.abs(regAsset.transDate - asset.transDate) < 100000
  );

  let resultAsset = {};
  if (duplAsset) {
    const setKeyword = new Set([
      ...(transAsset.keyword || []),
      ...(duplAsset.keyword || []),
    ]);
    transAsset.keyword = Array.from(setKeyword);
    resultAsset = await TransModel.findOneAndUpdate(
      { _id: duplAsset._id },
      { $set: transAsset },
      { new: true }
    );
  } else {
    resultAsset = await TransModel.create(transAsset);
  }
  const rule = await autosetCategoryAndUseKind(resultAsset);
  // console.log("rule", rule);
}

function setTransAsset(asset) {
  const assetNum = asset.CardNum || asset.BankAccountNum;
  const transMoney =
    parseInt(asset.CardApprovalCost || 0) * -1 ||
    parseInt(asset.Deposit) ||
    parseInt(asset.Withdraw) * -1;
  const cardData = {
    user: asset.user,
    corpNum: asset.CorpNum,
    corpName: asset.CorpName,
    cardNum: asset.CardNum,
    assetNum,
    transDate: asset.transDate,
    cardCompany: asset.cardCompany,
    cardApprovalType: asset.CardApprovalType,
    cardApprovalCost: asset.CardApprovalNum,
    serviceCharge: asset.ServiceCharge,
    amount: asset.Amount,
    tax: asset.Tax,
    totalAmount: asset.TotalAmount,
    useStoreNum: asset.UseStoreNum,
    useStoreCorpNum: asset.UseStoreCorpNum,
    useStoreName: asset.UseStoreName,
    useStoreAddr: asset.UseStoreAddr,
    useStoreBizType: asset.UseStoreBizType,
    useStoreTel: asset.UseStoreTel,
    useStoreTaxType: asset.UseStoreTaxType,
    paymentPlan: asset.PaymentPlan,
    currency: asset.Currency,
    useKind: asset.useKind,
    transMoney,
    keyword: asset.keyword,
  };

  const accountData = {
    user: asset.user,
    corpNum: asset.CorpNum,
    corpName: asset.CorpName,
    bankAccountNum: asset.BankAccountNum,
    assetNum,
    transDate: asset.transDate,
    bank: asset.bank,
    transType: asset.TransType,
    transOffice: asset.TransOffice,
    transRemark: asset.TransRemark,
    transRefKey: asset.TransRefKey,
    mgtRemark1: asset.MgtRemark1,
    mgtRemark2: asset.MgtRemark2,
    useKind: asset.useKind,
    transMoney,
    keyword: asset.keyword,
  };

  return asset.CardNum ? cardData : accountData;
}

async function autosetCategoryAndUseKind(asset) {
  const query = { user: asset.user, $or: [] };
  const { useStoreName, transRemark } = asset;
  if (asset.useStoreName) query.$or.push({ useStoreName });
  if (asset.transRemark) query.$or.push({ transRemark });
  if (query.$or.length === 0) return;

  const rule = await CategoryRuleModel.findOne(query);
  if (rule) {
    await updateKeywordCategoryRule({
      category: rule.category,
      categoryName: rule.categoryName,
      useKind: rule.useKind,
    });
  } else {
    const code = await getAutosetCategoryCode(asset);
    if (!code) return;
    await updateKeywordCategoryRule({
      category: code,
      categoryName: defaultCategory.find((cate) => cate.code === code).name,
      useKind: asset.useKind,
    });
    console.log("rule keyword");
  }
}

async function updateKeywordCategoryRule({ category, categoryName, useKind }) {
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
  asset.keyword.forEach((keyword) => {
    if (cateObj[keyword]) {
      code = cateObj[keyword];
    }
  });

  if (!code) {
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
  const filter = req.query.corpNum ? { corpNum: req.query.corpNum } : {};
  return TransModel.find(filter).sort({ transDate: -1 });
}

export async function updateTransMoney(req) {
  const _id = mongoose.Types.ObjectId(req.params.id);
  const { useKind, category, categoryName } = req.body;
  return TransModel.updateOne(
    { _id },
    { $set: { useKind, category, categoryName } }
  );
}
