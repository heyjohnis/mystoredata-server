import TaxLogModel from "../model/taxLogModel.js";
import { strToDate } from "../utils/date.js";
import { assetFilter } from "../utils/filter.js";

export async function regTaxLog(data, userInfo) {
  try {
    const existingData = await TaxLogModel.findOne({
      user: userInfo.user,
      ntsSendKey: data.NTSSendKey,
    });
    if (existingData) {
      return;
    }
    return await new AccountLogModel({
      user: data.user,
      userId: data.userId,
      corpName: data.corpName,
      corpNum: data.corpNum,
      ntsSendKey: data.NTSSendKey,
      ntsSendDT: strToDate(data.NTSSendDT),
      issueDT: strToDate(data.IssueDT),
      writeDate: data.WriteDate,
      modifyCode: data.ModifyCode,
      taxType: data.TaxType,
      purposeType: data.PurposeType,
      invoicerCorpNum: data.InvoicerCorpNum,
      invoicerTaxRegID: data.InvoicerTaxRegID,
      invoicerCorpName: data.InvoicerCorpName,
      invoicerCEOName: data.InvoicerCEOName,
      invoicerAddr: data.InvoicerAddr,
      invoicerBizType: data.InvoicerBizType,
      invoicerBizClass: data.InvoicerBizClass,
      invoicerContactName: data.InvoicerContactName,
      invoicerEmail: data.InvoicerEmail,
      invoiceeCorpNum: data.InvoiceeCorpNum,
      invoiceeTaxRegID: data.InvoiceeTaxRegID,
      invoiceeCorpName: data.InvoiceeCorpName,
      invoiceeCEOName: data.InvoiceeCEOName,
      invoiceeAddr: data.InvoiceeAddr,
      invoiceeBizType: data.InvoiceeBizType,
      invoiceeBizClass: data.InvoiceeBizClass,
      invoiceeContactName: data.InvoiceeContactName,
      invoiceeEmail: data.InvoiceeEmail,
      brokerCorpNum: data.BrokerCorpNum,
      brokerTaxRegID: data.BrokerTaxRegID,
      brokerCorpName: data.BrokerCorpName,
      brokerCEOName: data.BrokerCEOName,
      brokerAddr: data.BrokerAddr,
      brokerBizType: data.BrokerBizType,
      brokerBizClass: data.BrokerBizClass,
      brokerContactName: data.BrokerContactName,
      brokerEmail: data.BrokerEmail,
      amountTotal: parseInt(data.AmountTotal),
      taxTotal: parseInt(data.TaxTotal),
      totalAmount: parseInt(data.TotalAmount),
      cash: data.cash,
      itemName: data.ItemName,
      taxRegID: data.TaxRegID,
      taxCorpName: data.CorpName,
      ceoName: data.CEOName,
    })
      .save()
      .then((res) => res._id);
  } catch (error) {
    throw error;
  }
}

export async function getAccountLogs(req) {
  const filter = {};
  if (req.query?.corpNum || req.body?.corpNum)
    filter.corpNum = req.query?.corpNum || req.body?.corpNum;
  if (req.query?.userId || req.body?.userId)
    filter.userId = req.query?.userId || req.body?.userId;
  if (
    (req.query?.fromAt || req.body?.fromAt) &&
    (req.query?.toAt || req.body?.toAt)
  ) {
    const toAt = new Date(`${req.query?.toAt || req.body?.toAt}`);
    toAt.setDate(toAt.getDate() + 1);
    filter.transDate = {
      $gte: new Date(`${req.query?.fromAt || req.body?.fromAt}`),
      $lte: new Date(toAt),
    };
  }
  console.log("getAccountLogs filter: ", filter);
  return await AccountLogModel.find(filter).sort({ transDate: -1 });
}
