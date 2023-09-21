import soap from "soap";
import { config } from "../config.js";
import * as taxData from "../data/taxLogData.js";
import errorCase from "../middleware/baroError.js";

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

  return response[0].RegistTaxInvoiceScrapResult;
}

export async function getPeriodTaxInvoiceSalesListAsync(req) {
  const { corpNum, corpName, userId, user, fromAt, toAt } = req.body;

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
      for (const simpleTaxInvoice of logs) {
        taxData.regTaxLog(simpleTaxInvoice, {
          corpNum,
          corpName,
          userId,
          user,
        });
      }
      return logs.length + 1;
    }
  }
}
