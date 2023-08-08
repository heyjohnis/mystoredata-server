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
const User = Mongoose.model('user', schema);

export async function findByUserId(userId) {
  return User.findOne({ userId });
}

export async function createUser(data) {
  const user = await new User(data).save().then((res) => res.id)
  return createCorp({...data, user})
}

export default User;
