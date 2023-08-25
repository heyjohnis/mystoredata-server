import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: Object, required: true, ref: "user" },
    cardCompany: { type: String, required: true },
    CorpNum: { type: String, required: true },
    CorpName: { type: String, required: true },
    CardNum: { type: String, required: true },
    UseDT: { type: String, required: false },
    transDate: { type: Date, required: true },
    transAssetNum: { type: String, required: false },
    CardApprovalType: { type: String, required: false },
    CardApprovalNum: { type: String, required: false },
    CardApprovalCost: { type: String, required: false },
    Amount: { type: String, required: false },
    Tax: { type: String, required: false },
    ServiceCharge: { type: String, required: false },
    TotalAmount: { type: String, required: false },
    UseStoreNum: { type: String, required: false },
    UseStoreCorpNum: { type: String, required: false },
    UseStoreName: { type: String, required: false },
    UseStoreAddr: { type: String, required: false },
    UseStoreBizType: { type: String, required: false },
    UseStoreTel: { type: String, required: false },
    UseStoreTaxType: { type: String, required: false },
    PaymentPlan: { type: String, required: false },
    InstallmentMonths: { type: String, required: false },
    Currency: { type: String, required: false },
    keyword: { type: Array, required: false },
  },
  { timestamps: true }
);

useVirtualId(schema);
const CardLogModel = Mongoose.model(`cardLog`, schema);

export default CardLogModel;
