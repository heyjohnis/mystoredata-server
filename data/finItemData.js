import FinItemModel from "../model/finItemModel.js";
import { BankCorpCode, FinItemCode } from "../cmmCode.js";
import mongoose from "mongoose";
import UserModel from "../model/userModel.js";
import FinItemLogModel from "../model/finItemLogModel.js";

export async function regFinItem(req) {
  const {
    user,
    userId,
    account,
    bank,
    bankAccountNum,
    accountNum,
    amount,
    currentAmount,
    corpCode,
    itemKind,
    finItemCode,
    finItemName,
    transDate,
    defaultDate,
  } = req?.body || req;
  let userInfo;
  if (!user) {
    userInfo = await UserModel.findOne({ userId });
  }
  const bankCode = BankCorpCode.find((item) => item.baro === bank);
  const itemCode = FinItemCode.find((item) => item.code === "CHKACC");
  const finCorpName = corpCode
    ? BankCorpCode.find((item) => item.code === corpCode)?.name
    : bankCode.name;
  const item = {
    user: userInfo?._id || user,
    userId,
    account,
    accountNum: bankAccountNum || accountNum,
    itemKind: itemKind || "ASSET",
    itemKindName:
      itemKind === "ASSET"
        ? "자산"
        : itemKind === "LIABILITY"
        ? "부채"
        : "자산",
    finItemCode: finItemCode || finItemCode.code,
    finItemName: FinItemCode[finItemCode] || finItemCode.name,
    itemName: itemName || "자유입출금 예금",
    finCorpCode: corpCode || bankCode.code,
    finCorpName,
    isFixed: !!user,
    transDate: transDate || new Date(),
    amount: amount || 0,
    currentAmount: currentAmount || 0,
    defaultDate: new Date(defaultDate) || new Date(),
  };
  console.log("regFinItem item: ", item);
  try {
    return await new FinItemModel(item).save().then((result) => result);
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function listFinItem(req) {
  try {
    const { user, userId } = req.query;
    const query = {};
    if (user) query.user = user;
    if (userId) query.userId = userId;
    const finItems = await FinItemModel.find(query).sort({ itemName: 1 });
    return finItems;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function updateFinItem(req) {
  const _id = req.params._id;
  try {
    const {
      amount,
      account,
      currentAmount,
      defaultDate,
      accountNum,
      card,
      itemKind,
      itemKindName,
      finItemCode,
      finItemName,
      finCorpCode,
      finCorpName,
      itemName,
      transDate,
      useYn,
    } = req.body;
    const result = await FinItemModel.updateOne(
      { _id },
      {
        $set: {
          amount,
          currentAmount,
          defaultDate,
          account: mongoose.Types.ObjectId(account),
          accountNum,
          card,
          itemKind,
          itemKindName,
          finItemCode,
          finItemName,
          finCorpCode,
          finCorpName,
          itemName,
          transDate,
          useYn,
        },
      }
    );
    console.log({ result });
    return result;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export function deleteFinItem(req) {
  const _id = req.params._id;
  try {
    return FinItemModel.deleteOne({ _id });
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export function regFinItemLog(req) {
  const _id = req;
  try {
    return new FinItemLogModel(req.body).save();
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
