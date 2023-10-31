import TransModel from "../model/transModel.js";
import TaxLogModel from "../model/taxLogModel.js";
import { strToDate } from "../utils/date.js";
import FinItemModel from "../model/finItemModel.js";
import AccountLogModel from "../model/accountLogModel.js";
import DebtModel from "../model/debtModel.js";
import AssetModel from "../model/assetModel.js";

export async function getFinStatusAmountData(req) {
  const { userId, fromAt, toAt, payType } = req.body;
  const selPayType = !payType ? { $ne: null } : payType;
  try {
    const amount = await TransModel.aggregate([
      {
        $match: {
          userId,
          transDate: {
            $gte: strToDate(fromAt),
            $lte: strToDate(toAt),
          },
          useYn: true,
          useKind: "BIZ",
          payType: selPayType,
        },
      },
      {
        $group: {
          _id: "$finClassCode",
          amount: { $sum: "$transMoney" },
        },
      },
    ]);
    return amount;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getFinStatusTaxData(req) {
  const { userId, fromAt, toAt } = req.body;
  try {
    const amount = await TaxLogModel.aggregate([
      {
        $match: {
          userId,
          ntsSendDT: {
            $gte: strToDate(fromAt),
            $lte: strToDate(toAt),
          },
          useYn: true,
        },
      },
      {
        $group: {
          _id: "$tradeTypeCode",
          total: { $sum: "$totalAmount" },
          amount: { $sum: "$amountTotal" },
          tax: { $sum: "$taxTotal" },
        },
      },
    ]);
    return amount;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getFinStatusAccountData(req) {
  const { userId, toAt } = req.body;
  try {
    const items = await FinItemModel.find({ userId, useYn: true });
    const assets = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].itemType === "CHKACC") {
        const accountLog = await AccountLogModel.findOne({
          account: items[i].account,
          transDate: { $lte: strToDate(toAt) },
        }).sort({ transDate: -1 });
        if (accountLog) {
          console.log("accountLog: ", accountLog);
          items[i].amount = accountLog?.balance;
          items[i].logDate = accountLog?.transDate;
        }
      }
      assets.push(items[i]);
    }
    return assets;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getFinStatusAssetData(req) {
  const { userId, fromAt, toAt } = req.body;
  try {
    const items = await TransModel.aggregate([
      {
        $match: {
          userId,
          transDate: {
            $gte: strToDate(fromAt),
            $lte: strToDate(toAt),
          },
          useYn: true,
          asset: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$asset",
          transMoney: { $sum: "$transMoney" },
        },
      },
    ]);
    console.log("asset aggregate: ", items);

    const result = [];
    for (const item of items) {
      const itemResult = await AssetModel.findOne({ _id: item._id });
      result.push({
        ...item,
        finName: itemResult?.finName,
        finItemName: itemResult?.finItemName,
        finItemCode: itemResult?.finItemCode,
      });
    }
    return result;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getFinStatusDebtData(req) {
  const { userId, fromAt, toAt } = req.body;
  try {
    const items = await TransModel.aggregate([
      {
        $match: {
          userId,
          transDate: {
            $gte: strToDate(fromAt),
            $lte: strToDate(toAt),
          },
          useYn: true,
          debt: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$debt",
          transMoney: { $sum: "$transMoney" },
        },
      },
    ]);

    const result = [];
    for (const item of items) {
      const itemResult = await DebtModel.findOne({ _id: item._id });
      result.push({
        ...item,
        finName: itemResult?.finName,
        finItemName: itemResult?.finItemName,
        finItemCode: itemResult?.finItemCode,
      });
    }
    return result;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
