import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';
import { createCorp } from './corpData.js';

const types = Mongoose.Types;
const schema = new Mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    corpNum: { type: String ,required: false },
    corpName: { type: String },
    corpId: { type: types.ObjectId },
    accounts: { type: Array }, 
    cards: { type: Array }
  }, { timestamps: true }
);

useVirtualId(schema);
const User =  Mongoose.model('user', schema);

export async function getUserList(req) {
  return User.find().sort({ createdAt: -1 });
}

export async function findById(_id) {
  return User.findOne({ _id });
}

export async function findByUserId(userId) {
  return User.findOne({ userId });
}

export async function createUser(data) {
  const user = await new User(data).save().then((res) => res.id)
  return createCorp({...data, user})
}

export async function regAccount(_id, newAccount ) {
  
  const userInfo = await User.findOne({_id});
  const accounts = userInfo.accounts;
  console.log("accouts: ", accounts);
  
  const hasAccout = accounts.find( accont => accont.corpNum === newAccount.corpNum);
  console.log("hasAccout", hasAccout);
  if(!hasAccout) {
   return User.findByIdAndUpdate(_id, { $push: { accounts: newAccount }}, { returnOriginal: false });
  }
}

export async function deleteAccout ( _id, accountNum ) {

  return await User.findByIdAndUpdate( _id, { $pull: { accounts: { corpNum: accountNum} }});
}

export default User;
