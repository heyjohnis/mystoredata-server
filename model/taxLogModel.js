import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const TaxLogSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    tradeCorp: { type: types.ObjectId, ref: `tradecorp`, required: false },
    userId: { type: String, required: true },
    corpName: { type: String, required: true },
    corpNum: { type: String, required: true },
    ntsSendKey: { type: String, required: false },
    ntsSendDT: { type: Date, required: false },
    tradeType: { type: String, required: false },
    tradeTypeCode: { type: Number, required: false },
    issueDT: { type: Date, required: false },
    transDate: { type: Date, required: false },
    writeDate: { type: String, required: false },
    modifyCode: { type: Number, required: false },
    taxType: { type: Number, required: false },
    purposeType: { type: Number, required: false },
    invoicerCorpNum: { type: String, required: false },
    invoicerTaxRegID: { type: String, required: false },
    invoicerCorpName: { type: String, required: false },
    invoicerCEOName: { type: String, required: false },
    invoicerAddr: { type: String, required: false },
    invoicerBizType: { type: String, required: false },
    invoicerBizClass: { type: String, required: false },
    invoicerContactName: { type: String, required: false },
    invoicerEmail: { type: String, required: false },
    invoiceeCorpNum: { type: String, required: false },
    invoiceeTaxRegID: { type: String, required: false },
    invoiceeCorpName: { type: String, required: false },
    invoiceeCEOName: { type: String, required: false },
    invoiceeAddr: { type: String, required: false },
    invoiceeBizType: { type: String, required: false },
    invoiceeBizClass: { type: String, required: false },
    invoiceeContactName: { type: String, required: false },
    invoiceeEmail: { type: String, required: false },
    brokerCorpNum: { type: String, required: false },
    brokerTaxRegID: { type: String, required: false },
    brokerCorpName: { type: String, required: false },
    brokerCEOName: { type: String, required: false },
    brokerAddr: { type: String, required: false },
    brokerBizType: { type: String, required: false },
    brokerBizClass: { type: String, required: false },
    brokerContactName: { type: String, required: false },
    brokerEmail: { type: String, required: false },
    amountTotal: { type: Number, required: false },
    taxTotal: { type: Number, required: false },
    totalAmount: { type: Number, required: false },
    cash: { type: Number, required: false },
    itemName: { type: String, required: false },
    useYn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

useVirtualId(TaxLogSchema);
const TaxLogModel = Mongoose.model(`taxLog`, TaxLogSchema);

export default TaxLogModel;
