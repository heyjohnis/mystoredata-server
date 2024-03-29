import TaxLogModel from "../model/taxLogModel.js";
import { strToDate } from "../utils/date.js";
import { regexCorpName } from "../utils/filter.js";

export async function regTaxLog(data, userInfo, tradeCorp) {
  try {
    const existingData = await TaxLogModel.findOne({
      user: userInfo.user,
      ntsSendKey: data.NTSSendKey,
    });
    if (existingData) {
      return;
    }
    const tradeType = userInfo.corpNum === data.InvoicerCorpNum ? "D" : "C";
    // D : 매출, C : 매입
    return await new TaxLogModel({
      user: userInfo.user,
      userId: userInfo.userId,
      corpName: userInfo.corpName,
      corpNum: userInfo.corpNum,
      ntsSendKey: data.NTSSendKey,
      tradeType,
      tradeCorp,
      ntsSendDT: strToDate(data.NTSSendDT),
      issueDT: strToDate(data.IssueDT),
      writeDate: data.WriteDate,
      modifyCode: parseInt(data.ModifyCode),
      taxType: parseInt(data.TaxType),
      purposeType: parseInt(data.PurposeType),
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
      transDate: strToDate(data.IssueDT),
    })
      .save()
      .then((res) => res);
  } catch (error) {
    throw error;
  }
}

export async function getTaxLogs(req) {
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
  if (req.query?.tradeCorp || req.body?.tradeCorp)
    filter.tradeCorp = req.query?.tradeCorp || req.body?.tradeCorp;
  console.log("getTax filter: ", filter);
  return await TaxLogModel.find(filter).sort({ issueDT: -1 });
}

export async function notUseCanceledTaxLog(user) {
  const canceledTaxlogs = await TaxLogModel.find({
    user: user.user,
    totalAmount: { $lte: 0 },
  });
  console.log("canceledTaxlogs: ", canceledTaxlogs?.length);
  for (const log of canceledTaxlogs) {
    const canceledLog = await TaxLogModel.findOneAndUpdate(
      {
        itemName: log.itemName,
        totalAmount: log.totalAmount * -1,
        issueDT: { $lte: log.issueDT },
      },
      { $set: { useYn: false } }
    );
    console.log(
      "canceledLog2: ",
      canceledLog?.itemName,
      canceledLog?.totalAmount
    );
    await TaxLogModel.findOneAndUpdate(
      { _id: log._id },
      { $set: { useYn: false } }
    );
    console.log(
      "canceledLog1: ",
      canceledLog?.itemName,
      canceledLog?.totalAmount
    );
  }
}

export async function isTaxRecipt(log) {
  const existingData = await TaxLogModel.find();
  const item = existingData.reduce((acc, cur) => {
    return new Set([
      ...acc,
      regexCorpName(cur.invoicerCorpName),
      regexCorpName(cur.invoiceeCEOName),
      regexCorpName(cur.invoiceeCorpName),
      regexCorpName(cur.invoiceeCEOName),
    ]);
  }, new Set());
  console.log(
    "regexCorpName(log.transRemark): ",
    regexCorpName(log.transRemark)
  );
  const isIncluded = [...item].includes(regexCorpName(log.transRemark));

  console.log("existingData items: ", isIncluded);
  return isIncluded;
}
