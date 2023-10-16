import soap from "soap";
import { config } from "../config.js";
import * as taxData from "../data/taxLogData.js";
import errorCase from "../middleware/baroError.js";
import TradeCorpModel from "../model/tradeCorpModel.js";

const certKey = config.baro.testCertKey;

const client = await soap.createClientAsync(
  "https://testws.baroservice.com/TI.asmx?WSDL"
); // 운영서버

export async function registTaxInvoiceScrapAsync(req) {
  const { corpNum, hometaxPWD, hometaxID } = req.body;
  const hometaxLoginMethod = "ID";
  const response = await client.RegistTaxInvoiceScrapAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    HometaxLoginMethod: hometaxLoginMethod,
    HometaxID: hometaxID,
    HometaxPWD: hometaxPWD,
  });
  console.log("response: ", baroError(response[0].RegistTaxInvoiceScrapResult));
  return response[0].RegistTaxInvoiceScrapResult;
}

export async function ReRegistTaxInvoiceScrapAsync(req) {
  const { corpNum } = req.body;
  const response = await client.ReRegistTaxInvoiceScrapAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
  });

  const result = response[0].ReRegistTaxInvoiceScrapResult;

  console.log("response: ", result);

  return result;
}

export async function CancelStopTaxInvoiceScrapAsync(req) {
  const { corpNum } = req.body;
  const response = await client.CancelStopTaxInvoiceScrapAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
  });
  const result = response[0].CancelStopTaxInvoiceScrapResult;

  console.log("response: ", result);

  return result;
}

export async function getPeriodTaxInvoiceSalesListAsync(userInfo) {
  const { corpNum, corpName, userId, user, fromAt, toAt } = userInfo;

  let currentPage = 1;
  const reqBaro = {
    CERTKEY: certKey,
    CorpNum: corpNum,
    UserID: userId,
    TaxType: 1,
    DateType: 1,
    StartDate: fromAt,
    EndDate: toAt,
    CountPerPage: 100,
    CurrentPage: currentPage,
  };
  let cntLog = 100;
  while (cntLog === 100) {
    const response = await client.GetPeriodTaxInvoiceSalesListAsync(reqBaro);
    const result = response[0].GetPeriodTaxInvoiceSalesListResult;
    if (result.CurrentPage < 0) {
      console.log("CurrentPage: ", errorCase(result.CurrentPage));
      // 호출 실패
      return result.CurrentPage;
    } else {
      const logs = !result.SimpleTaxInvoiceExList
        ? []
        : result.SimpleTaxInvoiceExList.SimpleTaxInvoiceEx;
      console.log("simpleTaxInvoices::::", logs);
      cntLog = logs.length;
      for (const log of logs) {
        let tradeCorpInfo = await TradeCorpModel.findOne({
          tradeCorpNum: log.InvoiceeCorpNum,
        });
        console.log("tradeCorpInfo: ", tradeCorpInfo);
        if (!tradeCorpInfo) {
          tradeCorpInfo = await new TradeCorpModel({
            user,
            userId,
            corpName,
            corpNum,
            tradeType: "매출",
            tradeTypeCode: 1,
            tradeCorpNum: log.InvoiceeCorpNum,
            tradeCorpName: log.InvoiceeCorpName,
          }).save();
        }
        await taxData.regTaxLog(
          log,
          {
            corpNum,
            corpName,
            userId,
            user,
          },
          tradeCorpInfo._id
        );
      }
      return logs.length + 1;
    }
  }
}

export async function getPeriodTaxInvoicePurchaseListAsync(userInfo) {
  const { corpNum, corpName, userId, user, fromAt, toAt } = userInfo;

  let currentPage = 1;
  const reqBaro = {
    CERTKEY: certKey,
    CorpNum: corpNum,
    UserID: userId,
    TaxType: 1,
    DateType: 1,
    StartDate: fromAt,
    EndDate: toAt,
    CountPerPage: 100,
    CurrentPage: currentPage,
  };
  let cntLog = 100;
  while (cntLog === 100) {
    const response = await client.GetPeriodTaxInvoicePurchaseListAsync(reqBaro);
    const result = response[0].GetPeriodTaxInvoicePurchaseListResult;
    if (result.CurrentPage < 0) {
      console.log("CurrentPage: ", errorCase(result.CurrentPage));
      // 호출 실패
      return result.CurrentPage;
    } else {
      // 호출 성공
      const logs = !result.SimpleTaxInvoiceExList
        ? []
        : result.SimpleTaxInvoiceExList.SimpleTaxInvoiceEx;

      console.log("simpleTaxInvoices::::", logs);
      cntLog = logs.length;
      for (const log of logs) {
        let tradeCorpInfo = await TradeCorpModel.findOne({
          tradeCorpNum: log.InvoicerCorpNum,
        });
        console.log("tradeCorpInfo: ", tradeCorpInfo);

        if (!tradeCorpInfo) {
          tradeCorpInfo = await new TradeCorpModel({
            user,
            userId,
            corpName,
            corpNum,
            tradeType: "매입",
            tradeTypeCode: -1,
            tradeCorpNum: log.InvoicerCorpNum,
            tradeCorpName: log.InvoicerCorpName,
          }).save();
        }
        await taxData.regTaxLog(
          log,
          {
            corpNum,
            corpName,
            userId,
            user,
          },
          tradeCorpInfo._id
        );
      }
      return logs.length + 1;
    }
  }
}
