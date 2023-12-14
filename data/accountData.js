import Mongoose from "mongoose";
import UserModel from "../model/userModel.js";
import AccountLogModel from "../model/accountLogModel.js";
import AccountModel from "../model/accountModel.js";
import { assetFilter } from "../utils/filter.js";
import FinItemModel from "../model/finItemModel.js";
import * as finItemData from "./finItemData.js";

export async function getAccountList(req) {
  const filter = assetFilter(req);
  console.log("getAccountList filter: ", filter);
  return AccountModel.find(filter);
}

export async function getAccount(bankAccountNum) {
  return AccountModel.findOne({ bankAccountNum });
}

export async function regAccount(req) {
  const {
    user,
    bank,
    bankAccountNum,
    bankAccountType,
    bankAccountPwd,
    webId,
    webPwd,
    useKind,
    opsKind,
  } = req.body;
  const userInfo = await UserModel.findOne({ _id: user });
  const accounts = userInfo.accounts;
  const { _id, userId, corpNum, corpName } = userInfo;
  const hasAccount = accounts.find(
    (account) => account.bankAccountNum === bankAccountNum
  );
  if (!hasAccount) {
    // Accounts 에 등록
    const registedAccount = await new AccountModel({
      user: _id,
      userId,
      corpNum,
      corpName,
      bank,
      bankAccountNum: bankAccountNum || "",
      bankAccountType: bankAccountType || "C",
      bankAccountPwd: bankAccountPwd || "",
      webId: webId || "",
      webPwd: webPwd || "",
      useKind: useKind || "PERSONAL",
      opsKind,
    }).save();
    console.log("registedAccount: ", registedAccount);
    // Users 에 등록
    await UserModel.findByIdAndUpdate(
      _id,
      { $push: { accounts: registedAccount } },
      { returnOriginal: false }
    );
    // FinItems 에 등록
    const hasFinItem = await FinItemModel.findOne({
      user,
      account: registedAccount._id,
    });
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

export async function deleteAccount(req) {
  const { _id } = req.params;
  const { user } = req.body;
  console.log("deleteAccount: ", _id);
  // Accounts 에서 삭제
  await AccountModel.findOneAndDelete({ _id });
  // FinItems 에서 삭제
  await FinItemModel.deleteOne({ account: Mongoose.Types.ObjectId(_id) });
  // Users 에서 삭제
  return await UserModel.findOneAndUpdate(
    { _id: user },
    { $pull: { accounts: { _id } } }
  );
}

export async function updateAccount(req) {
  const { userId, bankAccountNum, useKind, opsKind } = req.body;
  const $set = {};
  if (useKind) $set.useKind = useKind;
  if (opsKind) $set.opsKind = opsKind;
  await AccountModel.updateOne({ bankAccountNum, userId }, { $set });
  const updateOption = {};
  if (useKind) updateOption["accounts.$.useKind"] = useKind;
  if (opsKind) updateOption["accounts.$.opsKind"] = opsKind;
  return await UserModel.updateOne(
    { userId, "accounts.bankAccountNum": bankAccountNum },
    updateOption
  );
}

export async function updateAccountAmount(req) {
  const bankAccountNum = req.body.bankAccountNum;
  console.log("updateAccountAmount: ", bankAccountNum);
  const lastTran = await AccountLogModel.findOne(
    { bankAccountNum },
    {},
    { sort: { transDate: -1 } }
  );
  if (!lastTran) return {};
  const balance = parseInt(lastTran.balance || 0);
  const result = await FinItemModel.updateOne(
    { account: lastTran.account },
    { $set: { amount: balance, transDate: lastTran.transDate } }
  );
  return result;
}
