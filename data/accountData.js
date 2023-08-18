import UserModel from '../model/userModel.js';
import AccountLogModel from '../model/accountLogModel.js';
import AccountModel from '../model/accountModel.js';

export async function getAccountList ( _id ) {
  return UserModel.findOne({ _id });
}

export async function getAccount ( bankAccountNum ) {
  return AccountModel.findOne({ bankAccountNum });
}

export async function regAccount(_id, newAccount ) {
  const userInfo = await UserModel.findOne({_id});
  const accounts = userInfo.accounts;  
  const hasAccount = accounts.find( account => account.bankAccountNum === newAccount.bankAccountNum);
  if(!hasAccount) {
    await new AccountModel({...newAccount, user: userInfo._id, corpName: userInfo.corpName, userId: userInfo.userId}).save();
    return  await UserModel.findByIdAndUpdate(_id, { $push: { accounts: newAccount }}, { returnOriginal: false });
  }
  return;
}

export async function deleteAccout ( _id, accountNum ) {
  console.log(_id, accountNum);
  await AccountModel.deleteOne({ bankAccountNum: accountNum, user: _id });
  return await UserModel.updateOne(
    { _id }, 
    { $pull: { accounts: { bankAccountNum: accountNum} } }
  );
}



