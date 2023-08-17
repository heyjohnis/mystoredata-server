import { createCorp } from './corpData.js';
import UserModel from '../model/userModel.js';

export async function getUserList(req) {
  return UserModel.find().sort({ createdAt: -1 });
}

export async function findById(_id) {
  return UserModel.findOne({ _id });
}

export async function findByUserId(userId) {
  return await UserModel.findOne({ userId });
}

export async function createUser(data) {
  const user = await new UserModel(data).save().then((res) => res._id);
  return createCorp({...data, user})
}

export async function updateUser(req) {
  const { _id, userName, email, mobile, corpNum, corpName, ceoName, bizType, bizClass, addr1, addr2 } = req.body;
  return await UserModel.updateOne( { _id }, { $set: { userName, email, mobile, corpNum, corpName, ceoName, bizType, bizClass, addr1, addr2}});
}
