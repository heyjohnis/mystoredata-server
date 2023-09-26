import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";
import * as finClassData from "../data/finClassData.js";
import { findById } from "../data/userData.js";

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

export async function updateTrans(req, res) {
  const data = await transData
    .updateTransMoney(req)
    .catch((error) => console.log(error));
  res.status(200).json(data);
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
  for (const card of cardLogs) {
    console.log("card: ", card.useStoreNum);
    await transData.mergeTransMoney(card).catch((error) => console.log(error));
  }
  await autoCancelCard(req);
  await finClassify(req);
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

export async function finClassify(req) {
  const { userId, fromAt, toAt } = fromToDateForMerge(req);
  const transLogs = await transData.getTransMoney({
    body: {
      userId,
      fromAt,
      toAt,
      category: "900",
    },
  });
  for (const log of transLogs) {
    await finClassData.updateFinClass(log);
  }
}

function fromToDateForMerge(req) {
  const fromAt =
    req.body.fromAt || new Date().toISOString().slice(0, 7) + "-01";
  const toAt = req.body.toAt || new Date().toISOString().slice(0, 10);
  return { fromAt, toAt };
}
