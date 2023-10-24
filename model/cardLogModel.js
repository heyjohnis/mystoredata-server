import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: Object, required: true, ref: "user" },
    userId: { type: String, required: true },
    corpNum: { type: String, required: true },
    corpName: { type: String, required: true },
    card: { type: Object, required: false, ref: `card` },
    cardCompany: { type: String, required: true },
    cardNum: { type: String, required: true },
    cardType: { type: String, required: true },
    payType: { type: String, required: true },
    useKind: { type: String, required: true },
    useDT: { type: String, required: false },
    transDate: { type: Date, required: true },
    transMoney: { type: Number, required: true, default: 0 },
    transAssetNum: { type: String, required: false },
    cardApprovalType: { type: String, required: false },
    cardApprovalNum: { type: String, required: false },
    cardApprovalCost: { type: String, required: false },
    amount: { type: String, required: false },
    tax: { type: String, required: false },
    serviceCharge: { type: String, required: false },
    totalAmount: { type: String, required: false },
    useStoreNum: { type: String, required: false },
    useStoreCorpNum: { type: String, required: false },
    useStoreName: { type: String, required: false },
    useStoreAddr: { type: String, required: false },
    useStoreBizType: { type: String, required: false },
    useStoreTel: { type: String, required: false },
    useStoreTaxType: { type: String, required: false },
    paymentPlan: { type: String, required: false },
    installmentMonths: { type: String, required: false },
    currency: { type: String, required: false },
    keyword: { type: Array, required: false },
  },
  { timestamps: true }
);

useVirtualId(schema);
const CardLogModel = Mongoose.model(`cardLog`, schema);

export default CardLogModel;
