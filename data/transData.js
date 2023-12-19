import mongoose from "mongoose";
import CategoryRuleModel from "../model/categoryRule.js";
import TransModel from "../model/transModel.js";
import { DefaultPersonalCategory, DefaultCorpCategory } from "../cmmCode.js";
import { keywordCategory } from "../data/categoryData.js";
import { fromAtDate, nowDate, toAtDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";
import { getFinClassByCategory } from "./finClassData.js";
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
    await linkAccountLogForCheckCard(transData);
  }
}

/* 중복 거래 확인(카드만 등록, 계좌만 등록, 기 등록된 거래인지?) */
export async function linkAccountLogForCheckCard(asset) {
  // 연결 계좌 거래내역 확인 후 카드 내역과 연결
  // 계좌만 등록되고 카드는 등록되지 않은 경우 (현금지출거래로 처리된 것이 있는지 확인)
  const logs = await TransModel.find({
    userId: asset.userId,
    transMoney: Math.abs(asset.transMoney),
    accountLog: { $ne: null },
    cardLog: null,
    transDate: {
      $gte: new Date(Number(asset.transDate) - 600000),
      $lte: new Date(Number(asset.transDate) + 600000),
    },
  });
  if (logs.length === 0) {
    console.log(
      "이미 연결됐거나 카드거래와 연결된 계좌 거래내역이 없습니다",
      asset.cardLog ? asset.cardLog : "(확인필요)"
    );
    return;
  } else if (logs.length === 1) {
    console.log(
      "카드거래와 연결해야할 계좌 거래내역이 있습니다",
      asset.cardLog
    );
    await TransModel.updateOne(
      {
        _id: logs[0]._id,
      },
      { cardLog: asset.cardLog, tradeKind: "CHECK" }
    );
    return await TransModel.findOneAndUpdate(
      { _id: asset._id },
      { $set: { accountLog: logs[0].accountLog } }
    );
  } else if (logs.length > 1) {
    const ids = logs.map((log) => log._id.toString());
    console.log("카드거래와 연결해야할 계좌 거래내역이 여러개 있습니다", ids);
    logs.forEach(async (log) => {
      if (ids.includes((log?.item || "").toString())) {
        await TransModel.deleteOne({ _id: log._id });
      } else {
        await TransModel.updateOne(
          {
            _id: log._id,
          },
          { cardLog: asset.cardLog, tradeKind: "CHECK" }
        );
        return await TransModel.findOneAndUpdate(
          { _id: asset._id },
          { $set: { accountLog: log.accountLog } }
        );
      }
    });
  }
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
  // 개인사용목적의 경우
  if (req.body.category === "-99999999") {
    filter.useKind = "PERSONAL";
    delete filter.category;
  }
  console.log("filter: ", filter);
  return TransModel.find(filter).sort({
    transDate: -1,
    transMoney: -1,
    finClassCode: 1,
  });
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
  filter.category = "500";
  filter.useYn = true;
  return TransModel.find(filter).sort({ transDate: -1 });
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
  const {
    useYn,
    _id,
    issueDT,
    amountTotal,
    invoiceeCorpName,
    invoicerCorpNum,
    invoicerCorpName,
    modifyCode,
    tradeType,
    taxTotal,
    totalAmount,
  } = taxLog;
  const taxData = {
    user,
    userId,
    corpNum,
    corpName,
    useYn: useYn,
    taxLog: _id,
    transDate: issueDT,
    transMoney: amountTotal,
    tradeKind: "BILL",
    useKind: "BIZ",
  };

  console.log("regTaxLogToTransLog taxData: ", taxData);
  // 매출의 경우
  if (
    (tradeType === "D" && modifyCode !== 4) ||
    (tradeType === "C" && modifyCode === 4)
  ) {
    taxData.transRemark = invoiceeCorpName;
    taxData.finClassCode = "IN1";
    taxData.finClassName = "번것(수익+)";
    taxData.category = "400";
    taxData.categoryName = "매출";
    taxData.tradeType = "C";
  } else {
    taxData.transRemark = invoicerCorpName;
    taxData.finClassCode = "OUT1";
    taxData.finClassName = "쓴것(비용+)";
    taxData.category = "-" + invoicerCorpNum;
    taxData.categoryName = invoicerCorpName;
    taxData.tradeType = "D";
  }

  try {
    // 매입, 매출 처리
    await new TransModel(taxData).save();
    // 부가세 처리
    if (
      (tradeType === "D" && modifyCode !== 4) ||
      (tradeType === "C" && modifyCode === 4)
    ) {
      taxData.finClassCode = "IN2";
      taxData.finClassName = "빌린것(부채+)";
      taxData.category = "850";
      taxData.categoryName = "부가세(내야할)";
      taxData.tradeType = "C";
    } else {
      taxData.finClassCode = "IN3";
      taxData.finClassName = "나머지(자산+)";
      taxData.category = "840";
      taxData.categoryName = "부가세(미리낸)";
      taxData.tradeType = "D";
    }
    taxData.transMoney = taxTotal;
    await new TransModel(taxData).save();
    // 매출채권, 미지급금 처리
    if (
      (tradeType === "D" && modifyCode !== 4) ||
      (tradeType === "C" && modifyCode === 4)
    ) {
      taxData.finClassCode = "IN3";
      taxData.finClassName = "나머지(자산+)";
      taxData.category = "550";
      taxData.categoryName = "매출채권";
      taxData.tradeType = "D";
    } else {
      taxData.finClassCode = "IN2";
      taxData.finClassName = "빌린것(부채+)";
      taxData.category = "540";
      taxData.categoryName = "미지급금";
      taxData.tradeType = "C";
    }
    taxData.transMoney = totalAmount;
    await new TransModel(taxData).save();
    return taxLog;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

/* 거래 취소된 내역 업데이트(취소처리) */
export async function upateCancelLog(log) {
  try {
    const { _id } = log;
    await TransModel.updateOne(
      {
        _id,
      },
      { $set: { useYn: false } }
    );
    await TransModel.updateOne(
      {
        transDate: log.transDate,
        transMoney: log.transMoney * -1,
        finClassCode: log.finClassCode,
        useYn: true,
      },
      { $set: { useYn: false } }
    );
    return { success: true };
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

/* 급여 거래내역 처리 */
export async function updateTransMoneyForEmployee(req, data) {
  return await TransModel.updateMany(
    {
      userId: req.body.userId,
      transRemark: req.body.transRemark,
      tradeType: "D",
    },
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
  const { userId, transRemark, finItemCode } = req.body;
  const $set = {};
  const category = finItemCode === "BORR" ? "480" : "";
  const categoryName = finItemCode === "BORR" ? "차입금" : "";

  // 계좌에서 출금일 경우(비용, 부채-, 자산+)
  const updated = await TransModel.updateMany(
    {
      userId,
      transRemark,
      finClassCode: { $in: ["OUT1", "OUT2", "IN3"] },
      categoryName: { $not: { $regex: "보통예금" } },
    },
    {
      $set: {
        debt: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "BORR" ? "OUT2" : "",
        finClassName: finItemCode === "BORR" ? "빌린것(부채-)" : "",
        asset: null,
        employee: null,
      },
    }
  );

  // 계좌에서 입금일 경우(수익, 부채+, 자산-)
  const updated2 = await TransModel.updateMany(
    {
      userId,
      transRemark,
      finClassCode: { $in: ["IN1", "IN2", "OUT3"] },
      categoryName: { $not: { $regex: "보통예금" } },
    },
    {
      $set: {
        debt: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "BORR" ? "IN2" : "",
        finClassName: finItemCode === "BORR" ? "갚은것(부채+)" : "",
        asset: null,
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

  // 계좌에서 출금일 경우(비용, 부채-, 자산+)
  const updated = await TransModel.updateMany(
    {
      userId,
      transRemark,
      finClassCode: { $in: ["OUT1", "OUT2", "IN3"] },
      categoryName: { $not: { $regex: "보통예금" } },
    },
    {
      $set: {
        asset: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "LOAN" ? "IN3" : "",
        finClassName: finItemCode === "LOAN" ? "나머지(자산+)" : "",
        debt: null,
        item: null,
        employee: null,
      },
    }
  );
  // 계좌에서 입금일 경우(수익, 부채+, 자산-)
  const updated2 = await TransModel.updateMany(
    {
      userId,
      transRemark,
      finClassCode: { $in: ["IN1", "IN2", "OUT3"] },
      categoryName: { $not: { $regex: "보통예금" } },
    },
    {
      $set: {
        asset: data._id,
        category,
        categoryName,
        finClassCode: finItemCode === "LOAN" ? "OUT3" : "",
        finClassName: finItemCode === "LOAN" ? "나머지(자산-)" : "",
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

export async function checkHasDabtAndCreateCreditCardDebt(data, creditCardLog) {
  const { _id, createAt, card, cardLog, updatedAt, ...debt } = data._doc;
  const hasTran = await TransModel.findOne({
    item: creditCardLog,
    category: "500",
    useYn: true,
  });
  if (!hasTran) {
    debt.category = "500";
    debt.categoryName = "카드대금";
    debt.finClassCode = "IN2";
    debt.finClassName = "빌린것(부채+)";
    debt.transMoney = parseInt(debt.cardApprovalCost);
    debt.tradeType = "C";
    debt.tradeKind = "CREDIT";
    return await new TransModel({
      ...debt,
      debt: _id,
      cardLog: _id,
      item: creditCardLog,
    }).save();
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
  data.tradeType = data.tradeType === "D" ? "C" : "D";
  return await new TransModel(data).save();
}

export async function updateTransDataFromAccountLog({ _id, item }) {
  return await TransModel.updateOne({ _id }, { $set: { item } });
}

export async function getTradeItem(req) {
  const id = mongoose.Types.ObjectId(req.body._id);
  return await TransModel.find({
    $or: [
      { asset: id },
      { debt: id },
      { item: id },
      { employee: id },
      { cardLog: id },
      { accountLog: id },
      { taxLog: id },
    ],
  });
}

export async function checkIsTransfer(log) {
  const { transMoney, tradeType, tradeKind } = log;
  if (tradeKind === "CASH") return false;
  if (tradeType === "D" && transMoney > 0) return true;
  if (tradeType === "C" && transMoney < 0) return true;
  return false;
}

export async function updateTransferLog(log, transferLog) {
  await TransModel.updateOne(
    { _id: log._id },
    { $set: { item: transferLog.accountLog } }
  );
  await TransModel.updateOne(
    { _id: transferLog._id },
    { $set: { item: log.accountLog } }
  );
}
