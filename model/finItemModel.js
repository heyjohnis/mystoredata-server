import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const FinItemSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    account: { type: types.ObjectId, required: false, ref: `account` },
    accountNum: { type: String, required: false },
    card: { type: types.ObjectId, required: false, ref: `card` },
    itemKind: { type: String, required: true },
    itemKindName: { type: String, required: true },
    itemType: { type: String, required: true },
    itemTypeName: { type: String, required: true },
    finCorpCode: { type: String, required: false },
    finCorpName: { type: String, required: false },
    itemName: { type: String, required: true },
    currentAmount: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 },
    defaultDate: { type: Date, required: true, default: Date.now },
    isFixed: { type: Boolean, required: true, default: false },
    useYn: { type: Boolean, required: true, default: true },
    logDate: { type: Date, required: false },
  },
  { timestamps: true }
);

useVirtualId(FinItemSchema);
const FinItemModel = Mongoose.model(`finitem`, FinItemSchema);

export default FinItemModel;
