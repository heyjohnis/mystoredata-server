import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const FinItemLogSchema = new Mongoose.Schema(
  {
    itemId: { type: types.ObjectId, ref: `finitem`, required: true },
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    account: { type: Object, required: false, ref: `account` },
    accountNum: { type: String, required: false },
    card: { type: Object, required: false, ref: `card` },
    itemKind: { type: String, required: true },
    itemKindName: { type: String, required: true },
    itemType: { type: String, required: true },
    itemTypeName: { type: String, required: true },
    finCorpCode: { type: String, required: false },
    finCorpName: { type: String, required: false },
    itemName: { type: String, required: true },
    amount: { type: Number, required: true },
    isFixed: { type: Boolean, required: true, default: false },
    useYn: { type: Boolean, required: true, default: true },
    logDate: { type: Date, required: true },
  },
  { timestamps: true }
);

useVirtualId(FinItemLogSchema);
const FinItemLogModel = Mongoose.model(`finitemLog`, FinItemLogSchema);

export default FinItemLogModel;
