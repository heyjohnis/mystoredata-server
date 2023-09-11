import FinItemtModel from "../model/finItemModel.js";
import { BankCorpCode, FinItemCode } from "../cmmCode.js";
import mongoose from "mongoose";
import UserModel from "../model/userModel.js";
export async function regFinItem(req) {
  console.log("regFinItem: ", req.body || req);
  const {
    user,
    userId,
    account,
    bank,
    bankAccountNum,
    accountNum,
    amount,
    corpCode,
    itemKind,
    itemType,
    itemTypeName,
    itemName,
  } = req.body || req;
  let userInfo;
  if (user) {
    userInfo = await UserModel({ userId }).findOne();
  }
  const bankCode = BankCorpCode.find((item) => item.baro === bank);
  const itemCode = FinItemCode.find((item) => item.code === "CHKACC");
  const item = {
    user,
    userId,
    account: mongoose.Types.ObjectId(account),
    accountNum: bankAccountNum,
    itemKind: "ASSET",
    itemKindName: "자산",
    itemType: itemCode.code,
    itemTypeName: itemCode.name,
    itemName: "자유입출금 예금",
    finCorpCode: bankCode.code,
    finCorpName: bankCode.name,
    isFixed: true,
    amount: 0,
  };

  console.log("regFinItem: ", item);
  try {
    const finItem = await new FinItemtModel(item).save();
    console.log({ finItem });
    return finItem;
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
    const finItems = await FinItemtModel.find(query).sort({ itemName: 1 });
    console.log({ finItems });
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
      accountNum,
      card,
      itemKind,
      itemKindName,
      itemType,
      itemTypeName,
      finCorpCode,
      finCorpName,
      itemName,
      useYn,
    } = req.body;
    const result = await FinItemtModel.updateOne(
      { _id },
      {
        $set: {
          amount,
          account,
          accountNum,
          card,
          itemKind,
          itemKindName,
          itemType,
          itemTypeName,
          finCorpCode,
          finCorpName,
          itemName,
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
