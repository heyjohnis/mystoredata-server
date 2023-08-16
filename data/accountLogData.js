import UserModel from '../model/userModel.js';
import AccountLogModel from '../model/accountLogModel.js';

export async function getAccounts ( _id ) {
  return UserModel.findOne({ _id });
}

export async function regAccount(_id, newAccount ) {
  const userInfo = await UserModel.findOne({_id});
  const accounts = userInfo.accounts;  
  const hasAccout = accounts.find( account => account.bankAccountNum === newAccount.bankAccountNum);
  if(!hasAccout) {
   return UserModel.findByIdAndUpdate(_id, { $push: { accounts: newAccount }}, { returnOriginal: false });
  }
}

export async function deleteAccout ( accountNum ) {
  return await UserModel.updateOne(
    { 'accouts.corpNum': accountNum }, 
    { $pull: { accounts: { corpNum: accountNum} } }
  );
}

export async function regAccountLog ( data ) {
  const { user, CorpNum, Withdraw, BankAccountNum, Deposit, Balance, TransDT, 
    TransType, TransOffice, TransRemark, TransRefKey, MgtRemark1, MgtRemark2 } = data;

  try {
    const existingData = await AccountLogModel.findOne({
      user,
      BankAccountNum,
      Withdraw,
      TransDT,
      TransRefKey,
    });
    console.log("existingData", existingData);
    if (existingData) {
      return existingData;
    }

    return await new AccountLogModel(data).save().then((res) => res._id);
  } catch (error) {
    throw error;
  }
}

export async function getAccountLogs ( data ) {
  return AccountLogModel.find().sort({ createdAt: -1 });
}


