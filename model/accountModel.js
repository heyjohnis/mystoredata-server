import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const AccountSchema = new Mongoose.Schema(
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
    useKind: { type: String, required: false },
  },
  { timestamps: true }
);

useVirtualId(AccountSchema);
const AccountModel = Mongoose.model(`account`, AccountSchema);

export default AccountModel;
