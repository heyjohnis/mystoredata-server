import mongoose from "mongoose";
import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import { DefaultPersonalCategory, DefaultCorpCategory } from "../cmmCode.js";
import { keywordCategory } from "../data/categoryData.js";
import { fromAtDate, nowDate, toAtDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";
import { getFinClassByCategory, updateFinClass } from "./finClassData.js";
import { convertTransAsset } from "../model/transInterface.js";
import { setDepositTransData } from "../utils/convert.js";

export async function checkHasTransLog(id) {
  return await TransModel.findOne(id);
}

/* 통장 거래내역 거래내역에 등록 */
export async function regTransDataAccount(log) {
  const asset = convertTransAsset(log);
  // 보통예금으로 처리
  const transLog = setDepositTransData(asset);
  return await new TransModel(transLog).save();
}

/* 카드 거래내역 거래내역에 등록*/
export async function regTransDataCard(log) {
  const asset = convertTransAsset(log);

  asset.finClassCode = "OUT1";
  asset.finClassName = "쓴것(비용+)";

  if (asset.tradeKind === "CREDIT") {
    const transData = await new TransModel(asset).save();
    console.log("regTransDataCard: ", transData);
    await checkHasDabtAndCreateCreditCardDebt(log, transData._id);
  } else {
    asset.tradeKind = "CHECK";
    const transData = await new TransModel(asset).save();
    const linkLog = await linkAccountLogForCheckCard(transData);
    if (!linkLog) {
      await TransModel.updateOne(
        { _id: transData._id },
        { $set: { accountLog: transData._id, tradeKind: "CHECK" } }
      );
    }
  }
}

/* 중복 거래 확인(카드만 등록, 계좌만 등록, 기 등록된 거래인지?) */
async function linkAccountLogForCheckCard(asset) {
  return await TransModel.findOneAndUpdate(
    {
      userId: asset.userId,
      transMoney: asset.transMoney,
      accountLog: { $ne: null },
      item: null,
      transDate: {
        $gte: new Date(Number(asset.transDate) - 200000),
        $lte: new Date(Number(asset.transDate) + 200000),
      },
    },
    { cardLog: asset._id, tradeKind: "CHECK", item: asset._id },
    { returnOriginal: false }
  );
}

/* 자동으로 카테고리와 사용처 설정 */
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

/* 기 등록된 적요를 통해 카테고리 자동 설정 */
async function registedRemarkForCategory(asset) {
  const query = { user: asset.user, useKind: asset.useKind, $or: [] };
  const { useStoreName, transRemark } = asset;
  if (asset.useStoreName) query.$or.push({ useStoreName });
  if (asset.transRemark) query.$or.push({ transRemark });
  if (query.$or.length === 0) return;
  return await CategoryRuleModel.findOne(query);
}

/* 카테고리 설정 */
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

/* 키워드 및 형태소 분석을 통해 카테고리 자동 설정 */
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
    // 적요, 상점명, 업태의 내용에 키워드 포함 여부를 통한 카테고리 자동 설정
    const words = `${asset.transRemark} ${asset.useStoreName} ${asset.useStoreBizType}`;
    Object.keys(cateObj).forEach((key) => {
      if (words.includes(key)) {
        code = cateObj[key];
      }
    });
  }
  return code;
}

/* 거래내역 조회 */
export async function getTransMoney(req) {
  const filter = assetFilter(req);
  return TransModel.find(filter).sort({ transDate: -1 });
}

/* 거래처 거래내역 조회 */
export async function getTradeLogs(req) {
  const { userId, tradeCorp } = req.body;
  if (!tradeCorp) return;
  return TransModel.find({
    userId,
    tradeCorp: mongoose.Types.ObjectId(tradeCorp),
  });
}

/* 직원급여 거래내역 조회 */
export async function getEmployeeLogs(req) {
  const { userId, employee } = req.body;
  if (!employee) return;
  return TransModel.find({
    userId,
    employee: mongoose.Types.ObjectId(employee),
    useYn: true,
  });
}

/* 부채 거래내역 조회 */
export async function getDebtLogs(req) {
  const { userId, debt } = req.body;
  if (!debt) return;
  return TransModel.find({
    userId,
    debt: mongoose.Types.ObjectId(debt),
    useYn: true,
  });
}

/* 자산 거래내역 조회 */
export async function getAssetLogs(req) {
  const { userId, asset } = req.body;
  if (!asset) return;
  return TransModel.find({
    userId,
    asset: mongoose.Types.ObjectId(asset),
    useYn: true,
  });
}

/* 신용카드 거래내역 조회 */
export async function getCreditCardLogs(req) {
  const filter = assetFilter(req);
  filter.tradeKind = "CREDIT";
  filter.useYn = true;
  filter.finClassCode = "OUT1";
  return TransModel.find(filter);
}

/* 카드대금 조회 */
export async function getCashedPayableLogs(req) {
  const filter = assetFilter(req);
  filter.tradeKind = "CASH";
  filter.finClassCode = "OUT2";
  filter.category = "500";
  filter.useYn = true;
  return TransModel.find(filter);
}

/* 거래내역 수정 */
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

/* 세금계산서를 거래내역에 등록 */
export async function regTaxLogToTransLog(data, taxLog) {
  const { user, userId, corpNum, corpName } = data;
  const taxData = {
    user,
    userId,
    corpNum,
    corpName,
    useYn: taxLog.useYn,
    tax: taxLog._id,
    transDate: taxLog.issueDT,
    transMoney: taxLog.amountTotal,
    tradeKind: "BILL",
    useKind: "BIZ",
  };

  // 매출의 경우
  if (
    (taxLog.amountTotal > 0 && taxLog.modifyCode !== 4) ||
    (taxLog.amountTotal < 0 && taxLog.modifyCode === 4)
  ) {
    taxData.transRemark = taxLog.invoiceeCorpName;
    taxData.finClassCode = "IN1";
    taxData.finClassName = "번것(수익+)";
    taxData.category = "400";
    taxData.categoryName = "매출";
  } else {
    taxData.transRemark = taxLog.invoicerCorpName;
    taxData.finClassCode = "OUT1";
    taxData.finClassName = "쓴것(비용+)";
    taxData.category = "410";
    taxData.categoryName = "매입";
  }

  try {
    // 매입, 매출 처리
    await new TransModel(taxData).save();
    // 부가세 처리
    if (
      (taxLog.amountTotal > 0 && taxLog.modifyCode !== 4) ||
      (taxLog.amountTotal < 0 && taxLog.modifyCode === 4)
    ) {
      taxData.finClassCode = "IN2";
      taxData.finClassName = "빌린것(부채+)";
      taxData.category = "850";
      taxData.categoryName = "부가세(내야할)";
    } else {
      taxData.finClassCode = "OUT3";
      taxData.finClassName = "나머지(자산+)";
      taxData.category = "840";
      taxData.categoryName = "부가세(미리낸)";
    }
    taxData.transMoney = taxLog.taxTotal * -1;
    await new TransModel(taxData).save();
    // 매출채권, 미지급금 처리
    if (
      (taxLog.amountTotal > 0 && taxLog.modifyCode !== 4) ||
      (taxLog.amountTotal < 0 && taxLog.modifyCode === 4)
    ) {
      taxData.finClassCode = "OUT3";
      taxData.finClassName = "나머지(자산+)";
      taxData.category = "550";
      taxData.categoryName = "매출채권";
    } else {
      taxData.finClassCode = "IN2";
      taxData.finClassName = "빌린것(부채+)";
      taxData.category = "540";
      taxData.categoryName = "미지급금";
    }
    taxData.transMoney = taxLog.amountTotal * -1;
    await new TransModel(taxData).save();
    return taxLog;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

/* 거래 취소된 내역 업데이트(취소처리) */
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

/* 급여 거래내역 처리 */
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
        debt: null,
        asset: null,
        item: null,
      },
    }
  ).then((result) => result);
}

/* 부채 거래내역 처리 */
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
        asset: null,
        item: null,
        employee: null,
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
        asset: null,
        item: null,
        employee: null,
      },
    }
  );

  return { ...updated, ...updated2 };
}

/* 자산 거래내역 처리 */
export async function updateTransMoneyForAsset(req, data) {
  const { userId, transRemark, finItemCode } = req.body;
  const category = finItemCode === "LOAN" ? "470" : "";
  const categoryName = finItemCode === "LOAN" ? "대여금" : "";
  console.log("updateTransMoneyForAsset 자산정보: ", data);
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
        debt: null,
        item: null,
        employee: null,
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
        debt: null,
        item: null,
        employee: null,
      },
    }
  );
  return { ...updated, ...updated2 };
}

/* 미분류 카테고리 거래내역 조회 */
export async function getNoneCategoryTransMoney(req, cateCd) {
  const filter = assetFilter(req);
  filter.category = cateCd;
  console.log("getNonCategoryTransMoney: ", filter);
  return TransModel.find(filter).sort({ transDate: -1 });
}

/* 임시카테고리 적용 */
export async function updateCategoryTempCategory(log, categorySet) {
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

/* 거래분류별 카테고리 합산 */
export async function getTransCategoryByClass(req) {
  const { userId, fromAt, toAt, tradeKind } = req.body;
  const selTradeKind = !tradeKind ? { $ne: null } : tradeKind;
  return await TransModel.aggregate([
    {
      $match: {
        userId,
        transDate: {
          $gte: fromAtDate(fromAt),
          $lte: toAtDate(toAt),
        },
        useYn: true,
        //useKind: "BIZ",
        tradeKind: selTradeKind,
      },
    },
    {
      $group: {
        _id: {
          category: "$category",
          finClassCode: "$finClassCode",
          useKind: "$useKind",
        },
        categoryName: { $first: "$categoryName" },
        transMoney: { $sum: "$transMoney" },
        transDate: { $first: "$transDate" },
        useKind: { $first: "$useKind" },
      },
    },
    {
      $project: {
        category: "$_id.category",
        finClassCode: "$_id.finClassCode",
        categoryName: "$categoryName",
        transMoney: "$transMoney",
        transDate: "$transDate",
        useKind: "$useKind",
      },
    },
  ]);
}

export async function getCreditTransData(req) {
  const filter = assetFilter(req);
  filter.tradeKind = "CREDIT";
  filter.useYn = true;
  filter.finClassCode = "OUT1";
  return await TransModel.find(filter);
}

export async function checkHasDabtAndCreateCreditCardDebt(data, cardLog) {
  const { _id, createAt, card, updatedAt, ...debt } = data._doc;
  const hasTran = await TransModel.findOne({
    cardLog,
    category: "500",
    useYn: true,
  });
  if (!hasTran) {
    debt.category = "500";
    debt.categoryName = "카드대금";
    debt.finClassCode = "IN2";
    debt.finClassName = "빌린것(부채+)";
    debt.transMoney = debt.transMoney * -1;
    debt.tradeKind = "CREDIT";
    return await new TransModel({ ...debt, cardLog, debt: card }).save();
  }
}

export async function getOnlyAccountLogs(req) {
  const filter = assetFilter(req);
  filter.useYn = true;
  filter.cardLog = null;
  filter.accountLog = { $ne: null };
  filter.debt = null;
  filter.asset = null;
  filter.item = null;
  filter.employee = null;
  return await TransModel.find(filter);
}

export async function regTransDataFromAccountLog(log) {
  const { _id, ...data } = log._doc;
  data.item = _id;
  data.cardLog = null;
  data.category = null;
  data.categoryName = null;
  data.finClassCode = null;
  data.finClassName = null;
  data.tradeKind = "CASH";
  return await new TransModel(data).save();
}

export async function updateTransDataFromAccountLog({ _id, item }) {
  return await TransModel.updateOne({ _id }, { $set: { item } });
}

export async function getInOutAccount(req) {
  const { userId, fromAt, toAt, tradeKind } = req.body;
  const selTradeKind = !tradeKind ? { $ne: null } : tradeKind;
  console.log("getTransCategoryByClass: ", req.body);
  return await TransModel.aggregate([
    {
      $match: {
        userId,
        transDate: {
          $gte: fromAtDate(fromAt),
          $lte: toAtDate(toAt),
        },
        useYn: true,
        useKind: "BIZ",
        tradeKind: selTradeKind,
        category: { $regex: /-/ },
      },
    },
    {
      $group: {
        _id: { category: "$category", finClassCode: "$finClassCode" },
        categoryName: { $first: "$categoryName" },
        transMoney: { $sum: "$transMoney" },
        transDate: { $first: "$transDate" },
      },
    },
    {
      $project: {
        category: "$_id.category",
        finClassCode: "$_id.finClassCode",
        categoryName: "$categoryName",
        transMoney: "$transMoney",
        transDate: "$transDate",
      },
    },
  ]);
}
