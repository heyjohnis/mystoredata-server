import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';
import User from './userData.js';

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, required: true },
    CorpNum: { type: String, required: true },
    BankAccountNum: { type: String, required: true },
    Withdraw: { type: String, required: false },
    Deposit: { type: String, required: false },
    Balance: { type: String, required: false },
    TransDT: { type: String, required: false },
    TransType: { type: String, required: false },
    TransOffice: { type: String, required: false },
    TransRemark: { type: String, required: false },
    TransRefKey: { type: String, required: true },
    MgtRemark1: { type: String, required: false },
    MgtRemark2: { type: String, required: false },
  }, 
  { timestamps: true },
);

useVirtualId(schema);
const Account = Mongoose.model(`account`, schema);

export async function saveAccountLog(data) {
  return new Account(data).save().then( res => res.id);
}

export async function getAccounts ( _id ) {
  return User.findOne({ _id });
}

export async function regAccount(_id, newAccount ) {
  const userInfo = await User.findOne({_id});
  const accounts = userInfo.accounts;  
  const hasAccout = accounts.find( account => account.bankAccountNum === newAccount.bankAccountNum);
  if(!hasAccout) {
   return User.findByIdAndUpdate(_id, { $push: { accounts: newAccount }}, { returnOriginal: false });
  }
}

export async function deleteAccout ( accountNum ) {
  return await User.updateOne(
    { 'accouts.corpNum': accountNum }, 
    { $pull: { accounts: { corpNum: accountNum} } }
  );
}

export async function regAccountLog ( data ) {
  const { user, CorpNum, Withdraw, BankAccountNum, Deposit, Balance, TransDT, 
    TransType, TransOffice, TransRemark, TransRefKey, MgtRemark1, MgtRemark2 } = data;

  try {
    const existingData = await Account.findOne({
      user,
      BankAccountNum,
      Withdraw,
      TransDT,
      TransRefKey,
    });
    
    console.log("existingData: ", existingData);
    if (existingData) {
      return existingData;
    }

    return new Account(data).save().then((res) => res._id);
  } catch (error) {
    throw error;
  }
}

export async function getAccountLogs ( data ) {
  return Account.find().sort({ createdAt: -1 });
}


