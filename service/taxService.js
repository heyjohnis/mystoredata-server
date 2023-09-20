import soap from "soap";
import { config } from "../config.js";

const certKey = config.baro.certKey;

const client = await soap.createClientAsync(
  "https://ws.baroservice.com/TI.asmx?WSDL"
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
  const taxType = 1;
  const dateType = 1;
  const countPerPage = 10;
  const currentPage = 1;
  const { corpNum, userId, fromAt, toAt } = req.body;
  const response = await client.GetPeriodTaxInvoiceSalesListAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    UserID: userId,
    TaxType: taxType,
    DateType: dateType,
    StartDate: fromAt,
    EndDate: toAt,
    CountPerPage: countPerPage,
    CurrentPage: currentPage,
  });

  const result = response[0].GetPeriodTaxInvoiceSalesListResult;

  if (result.CurrentPage < 0) {
    // 호출 실패
    console.log(result.CurrentPage);
  } else {
    // 호출 성공
    console.log(result.CurrentPage);
    console.log(result.CountPerPage);
    console.log(result.MaxPageNum);
    console.log(result.MaxIndex);

    const simpleTaxInvoices = !result.SimpleTaxInvoiceExList
      ? []
      : result.SimpleTaxInvoiceExList.SimpleTaxInvoiceEx;

    for (const simpleTaxInvoice of simpleTaxInvoices) {
      // 필드정보는 레퍼런스를 참고해주세요.
      console.log(simpleTaxInvoice);
    }
  }
}
