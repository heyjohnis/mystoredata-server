import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";
import * as categoryData from "../data/categoryData.js";
import { fromToDateForMerge } from "../utils/date.js";
import { updateFinClass } from "../data/finClassData.js";

export async function mergeTrans(req, res) {
  try {
    await mergeAccountAndCard(req);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}

export async function mergeTransLogs(req, res) {
  const data = await transData
    .getTransMoney(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}

export async function getTradeLogs(req, res) {
  const data = await transData
    .getTradeLogs(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}
export async function getEmployeeLogs(req, res) {
  const data = await transData
    .getEmployeeLogs(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}

export async function getDebtLogs(req, res) {
  const data = await transData
    .getDebtLogs(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}

export async function getCreditCardLogs(req, res) {
  const data = await transData
    .getCreditCardLogs(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}

export async function getAssetLogs(req, res) {
  const data = await transData
    .getAssetLogs(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}

export async function updateTrans(req, res) {
  const data = await transData
    .updateTransMoney(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}

export async function updateCategory(req, res) {
  const data = await transData.updateCategory(req);
}

export async function mergeAccountAndCard(req) {
  const accountLogs = await accountLogData
    .getAccountLogs(req)
    .catch((error) => console.log(error));
  // TODO: redis로 변경
  for (const account of accountLogs) {
    await transData
      .mergeTransMoney(account)
      .catch((error) => console.log(error));
  }
  // TODO: redis로 변경
  const cardLogs = await cardLogData
    .getCardLogs(req)
    .catch((error) => console.log(error));

  // 통장개래와 카드거래를 합치기
  for (const card of cardLogs) {
    console.log("card: ", card.useStoreNum);
    // 거래분류 업데이트 처리 병행
    await transData.mergeTransMoney(card).catch((error) => console.log(error));
  }
  // 거래분류 업데이트
  await updateFinClass(req);
  // 취소거래 삭제처리
  await autoCancelCard(req);
  // 자동 카테고리 설정처리
  await autoSetCategory(req);
  // 미분류 카테고리 설정처리
  await autoSetNoneCategory(req);
  // 신용카드 미지급금 처리
  await createCreditCardDebt(req);
}

async function autoCancelCard(req) {
  const { fromAt, toAt } = fromToDateForMerge(req);
  const transLogs = await transData.getTransMoney({
    body: {
      fromAt,
      toAt,
    },
  });

  const canceledLogs = transLogs.filter(
    (log) => log.cardApprovalType === "취소"
  );
  for (const log of canceledLogs) {
    await transData.upateCancelLog(log);
  }
}

export async function autoSetCategory(req) {
  const { fromAt, toAt } = fromToDateForMerge(req);
  req.body.fromAt = fromAt;
  req.body.toAt = toAt;
  const transLogs = await transData.getNoneCategoryTransMoney(req, null);
  for (const log of transLogs) {
    await transData.autoSetCategoryAndUseKind(log);
  }
}

export async function autoSetNoneCategory(req) {
  const { fromAt, toAt } = fromToDateForMerge(req);
  req.body.fromAt = fromAt;
  req.body.toAt = toAt;
  const transLogs = await transData.getNoneCategoryTransMoney(req, "999");
  // console.log("미분류 category: ", transLogs);
  for (const log of transLogs) {
    const categorySet = await categoryData.setCategory(log);
    await transData.updateCategoryTempCategory(log, categorySet);
  }
}

export async function getTransCategoryByClass(req, res) {
  const data = await transData
    .getTransCategoryByClass(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}

export async function createCreditCardDebt(req) {
  const trans = await transData.getCreditTransData(req);
  let cnt = 0;
  for (const tran of trans) {
    // console.log("tran: ", tran);
    const hasData = await transData.checkHasDabtAndCreateCreditCardDebt(tran);
    cnt++;
  }
  return cnt;
}
