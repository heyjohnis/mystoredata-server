import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";
import * as categoryData from "../data/categoryData.js";
import { fromToDateForMerge } from "../utils/date.js";
import { updateFinClass } from "../data/finClassData.js";
import { nowDate } from "../utils/date.js";
import { link } from "fs";

export async function mergeTrans(req, res) {
  try {
    await regAccountAndCard(req);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
}

export async function getTransLogs(req, res) {
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
  // 통장 거래내역 등록 및 정보 동기화
  const accountLogs = await accountLogData
    .getAccountLogs(req)
    .catch((error) => console.log(error));
  for (const log of accountLogs) {
    // 통장 기등록 여부 확인
    const hasTransLog = await transData.checkHasTransLog({
      accountLog: log._id,
    });
    if (hasTransLog) continue;
    // 통장 거래내역 등록
    await transData
      .regTransDataAccount(log)
      .catch((error) => console.log(error));
  }
  // 카드 거래내역 등록 및 정보 동기화
  const cardLogs = await cardLogData
    .getCardLogs(req)
    .catch((error) => console.log(error));
  for (const log of cardLogs) {
    // 카드 기등록 여부 확인
    const hasTransLog = await transData.checkHasTransLog({ cardLog: log._id });
    // 계좌거래와 연결된 카드거래의 경우 패스
    if (hasTransLog?.accountLog) continue;
    // 카드거래는 동륵되었지만 통장 거래와 연결되지 않은 경우
    if (hasTransLog) {
      await transData
        .linkAccountLogForCheckCard(hasTransLog)
        .catch((error) => console.log(error));
      continue;
    }
    // 카드거래 등록과 계좌거래 연결 동시 진행
    await transData.regTransDataCard(log).catch((error) => console.log(error));
  }

  // 체크카드 사용을 제외한 통장 거래내역 (이체거래 포함)
  await regTradeOnlyAccountLogs(req);
  console.log(`[${nowDate()}] 체크카드 사용을 제외한 통장 거래내역 등록 완료`);

  // 거래분류 업데이트
  await updateFinClass(req);
  console.log(`[${nowDate()}] 거래분류 업데이트 완료`);

  // 취소거래 삭제처리
  await autoCancelCard(req);
  console.log(`[${nowDate()}] 취소거래 삭제처리 완료`);

  // 자동 카테고리 설정처리
  await autoSetCategory(req);
  console.log(`[${nowDate()}] 자동 카테고리 설정처리 완료`);

  // 미분류 카테고리 설정처리
  await autoSetNoneCategory(req);
  console.log(`[${nowDate()}] 미분류 카테고리 설정처리 완료`);
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
  // 등록된 신용카드 거래로그
  const trans = await transData.getCreditTransData(req);
  let cnt = 0;
  for (const tran of trans) {
    const hasData = await transData.checkHasDabtAndCreateCreditCardDebt(tran);
    cnt++;
  }
  return cnt;
}

export async function regTradeOnlyAccountLogs(req) {
  const logs = await transData.getOnlyAccountLogs(req);
  for (const log of logs) {
    // 기 등록 여부 확인 (item: accountLog)
    const hasTransLog = await transData.checkHasTransLog({
      item: log.accountLog,
    });
    if (hasTransLog) continue;
    // 이체 거래내역 연결
    const transferLog = logs.find((accountLog) => {
      return (
        accountLog.transMoney === log.transMoney &&
        accountLog.tradeType !== log.tradeType &&
        Math.abs(accountLog.transDate - log.transDate) < 1000 * 60
      );
    });

    if (transferLog) {
      await transData.updateTransferLog(log, transferLog);
      continue;
    }

    // 통장 거래내역 등록
    const registedData = await transData.regTransDataFromAccountLog(log);
    await transData.updateTransDataFromAccountLog({
      _id: log._id,
      item: registedData.accountLog,
    });
  }
}

export async function getTradeItem(req, res) {
  const data = await transData
    .getTradeItem(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
}
