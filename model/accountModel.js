import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    corpName: { type: String, required: true },
    corpNum: { type: String, required: true },
    bank: { type: String, required: true },
    bankAccountType: { type: String, required: true },
    bankAccountNum: { type: String, required: false },
    bankAccountPwd: { type: String, required: false },
    webId: { type: String, required: false },
    webPwd: { type: String, required: false },
  },
  { timestamps: true }
);

useVirtualId(schema);
const AccountModel = Mongoose.model(`account`, schema);

export default AccountModel;
