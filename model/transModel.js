import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    user: { type: Object, required: true, ref: 'user' },
    corpNum: { type: String, required: true },
    corpName: { type: String, required: true },
    assetNum: { type: String, required: true },
    transDate: { type: Date, required: false },
    cardCompany: { type: String, required: true },
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
    bank: { type: String, required: true },
    transMoney: { type: Number, required: false },
    transType: { type: String, required: false },
    transOffice: { type: String, required: false },
    transRemark: { type: String, required: false },
    transRefKey: { type: String, required: true },
    mgtRemark1: { type: String, required: false },
    mgtRemark2: { type: String, required: false },
  }, 
  { timestamps: true },
);

useVirtualId(schema);
const TransModel = Mongoose.model(`transMoney`, schema);

export default TransModel;