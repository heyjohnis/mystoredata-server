import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";
import * as categoryData from "../data/categoryData.js";

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
  // 취소거래 삭제처리
  await autoCancelCard(req);
  // 자동 카테고리 설정처리
  await autoSetCategory(req);
  // 미분류 카테고리 설정처리
  await autoSetNoneCategory(req);
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
  const transLogs = await transData.getNoneCategoryTransMoney(req);
  for (const log of transLogs) {
    await transData.autoSetCategoryAndUseKind(log);
  }
}

export async function autoSetNoneCategory(req) {
  const { userId, fromAt, toAt } = fromToDateForMerge(req);
  const transLogs = await transData.getTransMoney({
    body: {
      userId,
      fromAt,
      toAt,
      category: "999",
    },
  });
  console.log("미분류 category: ", transLogs);
  for (const log of transLogs) {
    await categoryData.setCategory(log);
  }
}

function fromToDateForMerge(req) {
  const userId = req.body.userId;
  const fromAt =
    req.body.fromAt || new Date().toISOString().slice(0, 7) + "-01";
  const toAt = req.body.toAt || new Date().toISOString().slice(0, 10);
  return { fromAt, toAt, userId };
}
