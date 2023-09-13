import * as cardLogData from "../data/cardLogData.js";
import * as accountLogData from "../data/accountLogData.js";
import * as transData from "../data/transData.js";
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
  await autoCancelCard();
}

async function autoCancelCard() {
  const baseMonth = new Date().toISOString().slice(0, 7);
  const baseDate = new Date().toISOString().slice(0, 10);
  const transLogs = await transData.getTransMoney({
    body: {
      fromAt: `${baseMonth}-01`,
      toAt: baseDate,
    },
  });

  const canceledLogs = transLogs.filter(
    (log) => log.cardApprovalType === "취소"
  );
  for (const log of canceledLogs) {
    await transData.upateCancelLog(log);
  }
}
