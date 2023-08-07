import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const userSchema = new Mongoose.Schema({
  loginId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  corpNum: { type: String }, 
  corpName: { type: String },
  url: String,
  createAt: { type: Date, required: true, }
});

useVirtualId(userSchema);
const User = Mongoose.model('User', userSchema);

export async function findByLoginId(loginId) {
  return User.findOne({ loginId });
}

export async function createUser(user) {
  return new User(user).save().then((data) => data.loginId);
}
