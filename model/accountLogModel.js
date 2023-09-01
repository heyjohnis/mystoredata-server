import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: Object, required: true, ref: "user" },
    userId: { type: String, required: true },
    bank: { type: String, required: true },
    CorpNum: { type: String, required: true },
    CorpName: { type: String, required: true },
    BankAccountNum: { type: String, required: true },
    Withdraw: { type: String, required: false },
    Deposit: { type: String, required: false },
    Balance: { type: String, required: false },
    TransDT: { type: String, required: false },
    transDate: { type: Date, required: true },
    transAssetNum: { type: String, required: false },
    TransType: { type: String, required: false },
    TransOffice: { type: String, required: false },
    TransRemark: { type: String, required: false },
    TransRefKey: { type: String, required: true },
    MgtRemark1: { type: String, required: false },
    MgtRemark2: { type: String, required: false },
    keyword: { type: Array, required: false },
  },
  { timestamps: true }
);

useVirtualId(schema);
const AccountLogModel = Mongoose.model(`accountLog`, schema);

export default AccountLogModel;
