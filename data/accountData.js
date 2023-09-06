import UserModel from "../model/userModel.js";
import AccountLogModel from "../model/accountLogModel.js";
import AccountModel from "../model/accountModel.js";
import { strToDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";
import FinItemtModel from "../model/finItemModel.js";
import * as finItemData from "./finItemData.js";
import mongoose from "mongoose";
export async function getAccountList(req) {
  const filter = assetFilter(req);
  return AccountModel.find(filter);
}

export async function getAccount(bankAccountNum) {
  return AccountModel.findOne({ bankAccountNum });
}

export async function regAccount(_id, newAccount) {
  const userInfo = await UserModel.findOne({ _id });
  const accounts = userInfo.accounts;
  const hasAccount = accounts.find(
    (account) => account.bankAccountNum === newAccount.bankAccountNum
  );
  if (!hasAccount) {
    const registedAccount = await new AccountModel({
      ...newAccount,
      user: userInfo._id,
      corpName: userInfo.corpName,
      userId: userInfo.userId,
    }).save();
    await UserModel.findByIdAndUpdate(
      _id,
      { $push: { accounts: registedAccount } },
      { returnOriginal: false }
    );
    const hasFinItem = await FinItemtModel.findOne({
      user: userInfo._id,
      account: registedAccount._id,
    });
    console.log("자산 등록 전: ", registedAccount);
    if (!hasFinItem) {
      await finItemData.regFinItem({
        user: registedAccount.user,
        userId: registedAccount.userId,
        account: registedAccount._id,
        bank: registedAccount.bank,
        bankAccountNum: registedAccount.bankAccountNum,
      });
    }
    return registedAccount;
  }
  return;
}

export async function deleteAccout(req) {
  const { bankAccountNum } = req.body;
  const _id = req.body.user || req.body._id || req._id;

  const resultDeleteAccount = await AccountModel.deleteOne({
    bankAccountNum,
    user: _id,
  });
  console.log({ resultDeleteAccount });
  const updatedAccount = await UserModel.findOneAndUpdate(
    { _id },
    { $pull: { accounts: { bankAccountNum } } }
  );
  console.log({ updatedAccount });
  return updatedAccount;
}

export async function updateAccount(req) {
  const { bankAccountNum, useKind } = req.body;
  await AccountModel.updateOne({ bankAccountNum }, { $set: { useKind } });
  return await UserModel.updateOne(
    { "accounts.bankAccountNum": bankAccountNum },
    { "accounts.$.useKind": useKind }
  );
}

export async function updateAccountAmount(req) {
  const bankAccountNum = req.body.bankAccountNum;
  console.log("updateAccountAmount: ", req.body);
  const lastTran = await AccountLogModel.findOne({ bankAccountNum }).sort({
    transDate: -1,
  });
  console.log({ lastTran });
  const balance = parseInt(lastTran.balance || 0);
  const result = await FinItemtModel.updateOne(
    { account: mongoose.Types.ObjectId(req.body._id) },
    { $set: { amount: balance } }
  );
  return result;
}
