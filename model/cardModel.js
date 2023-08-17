import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    corpName: { type: String, required: true },
    corpNum: { type: String, required: true },
    cardCompany: { type: String, required: true },
    cardType: { type: String, required: true },
    cardNum: { type: String, required: false },
    webId: { type: String, required: false },
    webPwd: { type: String, required: false },
  }, 
  { timestamps: true },
);

useVirtualId(schema);
const CardModel = Mongoose.model(`card`, schema);

export default CardModel;