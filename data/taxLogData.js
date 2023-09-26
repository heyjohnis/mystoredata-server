import TaxLogModel from "../model/taxLogModel.js";
import { strToDate } from "../utils/date.js";

export async function regTaxLog(data, userInfo) {
  try {
    const existingData = await TaxLogModel.findOne({
      user: userInfo.user,
      ntsSendKey: data.NTSSendKey,
    });
    if (existingData) {
      return;
    }

    const tradeTypeCode = userInfo.corpNum === data.InvoicerCorpNum ? 1 : -1;
    const tradeType =
      userInfo.corpNum === data.InvoicerCorpNum ? "매출" : "매입";
    return await new TaxLogModel({
      user: userInfo.user,
      userId: userInfo.userId,
      corpName: userInfo.corpName,
      corpNum: userInfo.corpNum,
      ntsSendKey: data.NTSSendKey,
      tradeType,
      tradeTypeCode,
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
      amountTotal: parseInt(data.AmountTotal) * tradeTypeCode,
      taxTotal: parseInt(data.TaxTotal) * tradeTypeCode,
      totalAmount: parseInt(data.TotalAmount) * tradeTypeCode,
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
  console.log("getTax filter: ", filter);
  return await TaxLogModel.find(filter).sort({ issueDT: -1 });
}

export async function notUseCanceledTaxLog(user) {
  const canceledTaxlogs = await TaxLogModel.find({
    user: user.user,
    modifyCode: { $gte: 1 },
  });
  console.log("canceledTaxlogs: ", canceledTaxlogs);
  for (const log of canceledTaxlogs) {
    const canceledLog = await TaxLogModel.findOneAndUpdate(
      {
        itemName: log.itemName,
        totalAmount: log.totalAmount * -1,
        issueDT: { $lte: log.issueDT },
      },
      { $set: { useYn: false } },
      { sort: { issueDT: -1 } }
    );
    console.log("canceledLog2: ", canceledLog);
    await TaxLogModel.findOneAndUpdate(
      { _id: log._id },
      { $set: { useYn: false } }
    );
    console.log("canceledLog1: ", canceledLog);
  }
}

export async function isTaxRecipt(log) {
  const existingData = await TaxLogModel.find();
  const item = existingData.reduce((acc, cur) => {
    return new Set([
      ...acc,
      regexWord(cur.invoicerCorpName),
      regexWord(cur.invoiceeCEOName),
      regexWord(cur.invoiceeCorpName),
      regexWord(cur.invoiceeCEOName),
    ]);
  }, new Set());
  console.log("regexWord(log.transRemark): ", regexWord(log.transRemark));
  const isIncluded = [...item].includes(regexWord(log.transRemark));

  console.log("existingData items: ", isIncluded);
  return isIncluded;
}

function regexWord(word) {
  if (!word) return "";
  const regex = /주식회사|\(주\)|\(주|주\)/gi;
  return word.replace(regex, "").trim();
}
