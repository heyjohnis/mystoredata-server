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
  const user = await User.findOne({ userId });
  console.log("user: ", user);
  return user;
}

export async function createUser(data) {
  const user = await new User(data).save().then((res) => res._id);
  return createCorp({...data, user})
}

export async function updateUser(req) {
  const { _id, name, email, corpNum, corpName } = req.body;
  return await User.updateOne( { _id }, { $set: { name, email, corpNum, corpName }});
}

export default User;
