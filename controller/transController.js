import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";
import * as categoryData from "../data/categoryData.js";
import { fromToDateForMerge } from "../utils/date.js";
import { updateFinClass } from "../data/finClassData.js";

export async function mergeTrans(req, res) {
  try {
    await regAccountAndCard(req);
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

/* 카드내역과 통장내역 등록 및 정보 동기화 */
export async function regAccountAndCard(req) {
  // 카드 거래내역 등록
  const accountLogs = await accountLogData
    .getAccountLogs(req)
    .catch((error) => console.log(error));
  for (const account of accountLogs) {
    // 통장 기등록 여부 확인
    const hasTransLog = await transData.checkHasTransLog({
      accountLog: account._id,
    });
    if (hasTransLog) continue;
    // 통장 거래내역 등록
    console.log("account: ", account);
    await transData
      .regTransDataAccount(account)
      .catch((error) => console.log(error));
  }

  // 카드 거래내역 등록 및 정보 동기화
  const cardLogs = await cardLogData
    .getCardLogs(req)
    .catch((error) => console.log(error));

  // 통장개래와 카드거래를 합치기
  for (const card of cardLogs) {
    // 카드 기등록 여부 확인
    const hasTransLog = await transData.checkHasTransLog({ cardLog: card._id });
    if (hasTransLog) continue;

    // 거래분류 업데이트 처리 병행
    await transData.regTransDateCard(card).catch((error) => console.log(error));
  }
  // 체크카드 사용을 제외한 통장 거래내역
  await getOnlyAccountLogs(req);
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

export async function getOnlyAccountLogs(req) {
  const logs = await transData.getOnlyAccountLogs(req);
  for (const log of logs) {
    const hasTransLog = await transData.checkHasTransLog({
      accountLog: log._id,
    });
    if (hasTransLog) continue;
    await transData.regTransDataFromAccountLog(log);
  }
}
