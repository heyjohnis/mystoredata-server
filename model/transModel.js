import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: "user", required: true },
    userId: { type: String, required: true },
    corpNum: { type: String, required: true },
    corpName: { type: String, required: true },
    account: { type: Object, required: false, ref: "account" },
    card: { type: Object, required: false, ref: "card" },
    transDate: { type: Date, required: false },
    transMoney: { type: Number, required: false },
    transAssetNum: { type: String, required: false },
    bank: { type: String, required: false },
    bankAccountNum: { type: String, required: false },
    transType: { type: String, required: false },
    transOffice: { type: String, required: false },
    transRemark: { type: String, required: false },
    transRefKey: { type: String, required: false },
    mgtRemark1: { type: String, required: false },
    mgtRemark2: { type: String, required: false },
    cardCompany: { type: String, required: false },
    cardNum: { type: String, required: false },
    cardApprovalType: { type: String, required: false },
    cardApprovalCost: { type: String, required: false },
    serviceCharge: { type: String, required: false },
    useStoreNum: { type: String, required: false },
    useStoreCorpNum: { type: String, required: false },
    useStoreName: { type: String, required: false },
    useStoreAddr: { type: String, required: false },
    useStoreBizType: { type: String, required: false },
    useStoreTel: { type: String, required: false },
    useStoreTaxType: { type: String, required: false },
    paymentPlan: { type: String, required: false },
    currency: { type: String, required: false },
    useKind: { type: String, required: false },
    category: { type: String, required: false },
    categoryName: { type: String, required: false },
    keyword: { type: Array, required: false },
    useYn: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

useVirtualId(schema);
const TransModel = Mongoose.model(`transMoney`, schema);

export default TransModel;
