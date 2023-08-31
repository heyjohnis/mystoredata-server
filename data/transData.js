import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import mongoose from "mongoose";
import { defaultCategory } from "../cmmCode.js";
import { keywordCategory } from "../data/categoryData.js";
import { nowDate } from "../utils/date.js";

export async function mergeTransMoney(asset) {
  const transAsset = convertTransAsset(asset);
  console.log(
    `${nowDate()}: 거래 checking start: ${transAsset.transAssetNum} ${
      transAsset.transMoney
    } ${transAsset.transRemark} ${transAsset.useStoreName}`
  );
  const query = {};
  query.corpNum = transAsset.corpNum;
  query.transMoney = transAsset.transMoney;
  query.transDate = {
    $gte: new Date(Number(transAsset.transDate) - 100000),
    $lte: new Date(Number(transAsset.transDate) + 100000),
  };
  // if (transAsset.bankAccountNum)
  //   query.bankAccountNum = { $ne: transAsset.bankAccountNum };

  // if (transAsset.cardNum) query.cardNum = { $ne: transAsset.cardNum };

  const guessDuplAssets = await TransModel.find(query);

  let isDuplicate = guessDuplAssets.length > 0;

  // if (guessDuplAsset?.transRemark) {
  //   isDuplicate =
  //     guessDuplAsset?.transRemark === transAsset.transRemark ? true : false;
  // }
  // if (guessDuplAsset?.useStoreName) {
  //   isDuplicate =
  //     guessDuplAsset?.useStoreName === transAsset.useStoreName ? true : false;
  // }

  let resultAsset = {};

  if (isDuplicate) {
    if (
      guessDuplAsset.cardNum === transAsset.cardNum ||
      guessDuplAsset.bankAccountNum === transAsset.bankAccountNum
    ) {
      console.log(
        `${nowDate()}: 기등록한 거래: ${transAsset.transAssetNum} ${
          transAsset.transMoney
        } ${transAsset.transRemark} ${transAsset.useStoreName}`
      );
      console.log("신규거래: ", new Date(Number(transAsset.transDate)));
      console.log("기등록거래: ", new Date(Number(guessDuplAsset.transDate)));
      return;
    }
    transAsset.keyword = Array.from(
      new Set([
        ...(transAsset.keyword || []),
        ...(guessDuplAsset.keyword || []),
      ])
    );
    resultAsset = await TransModel.findOneAndUpdate(
      { _id: guessDuplAsset._id },
      { $set: transAsset },
      { new: true }
    );
    console.log(
      `${nowDate()}: trans asset updated: ${resultAsset.transAssetNum} ${
        resultAsset.transMoney
      } ${resultAsset.transRemark} ${resultAsset.useStoreName}`
    );
  } else {
    resultAsset = await TransModel.create(transAsset);
    console.log(
      `${nowDate()}: trans asset created: ${resultAsset.transAssetNum} ${
        resultAsset.transMoney
      } ${resultAsset.transRemark} ${resultAsset.useStoreName}`
    );
  }
  // 카테고리 자동설정
  await autosetCategoryAndUseKind(resultAsset);
}

function convertTransAsset(asset) {
  const transAssetNum = asset.CardNum || asset.BankAccountNum;
  const transMoney =
    parseInt(asset.CardApprovalCost || 0) * -1 ||
    parseInt(asset.Deposit) ||
    parseInt(asset.Withdraw) * -1;
  const cardData = {
    user: asset.user,
    corpNum: asset.CorpNum,
    corpName: asset.CorpName,
    cardNum: asset.CardNum,
    transAssetNum,
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
    transAssetNum,
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
  // 기 등록된 적요를 통해 카테고리 자동 설정
  const registedRemark = await registedRemarkForCategory(asset);

  if (registedRemark) {
    await updateKeywordCategoryRule({
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
      categoryName: defaultCategory.find((cate) => cate.code === code).name,
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
