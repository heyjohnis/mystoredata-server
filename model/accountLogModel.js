import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: Object, required: true, ref: "user" },
    userId: { type: String, required: true },
    useKind: { type: String, required: true },
    bank: { type: String, required: true },
    corpNum: { type: String, required: true },
    corpName: { type: String, required: true },
    bankAccountNum: { type: String, required: true },
    account: { type: Object, required: false, ref: `account` },
    withdraw: { type: String, required: false },
    deposit: { type: String, required: false },
    balance: { type: String, required: false },
    transDT: { type: String, required: false },
    transDate: { type: Date, required: true },
    transMoney: { type: Number, required: true, default: 0 },
    transAssetNum: { type: String, required: false },
    transType: { type: String, required: false },
    transOffice: { type: String, required: false },
    transRemark: { type: String, required: false },
    transRefKey: { type: String, required: true },
    mgtRemark1: { type: String, required: false },
    mgtRemark2: { type: String, required: false },
    keyword: { type: Array, required: false },
  },
  { timestamps: true }
);

useVirtualId(schema);
const AccountLogModel = Mongoose.model(`accountLog`, schema);

export default AccountLogModel;
