import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const types = Mongoose.Types;
const schema = new Mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    corpNum: { type: String ,required: false },
    corpName: { type: String },
    ceoName: { type: String ,required: false },
    bizType: { type: String ,required: false },
    bizClass: { type: String ,required: false },
    addr1: { type: String ,required: false },
    addr2: { type: String ,required: false },
    mobile: { type: String ,required: false },
    corpId: { type: types.ObjectId },
    accounts: { type: Array }, 
    cards: { type: Array },
    category: { type: Object, required: false },
  }, { timestamps: true }
);

useVirtualId(schema);
const UserModel =  Mongoose.model('user', schema);
export default UserModel;
