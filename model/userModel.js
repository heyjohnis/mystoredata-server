import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

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
const UserModel =  Mongoose.model('user', schema);
export default UserModel;
