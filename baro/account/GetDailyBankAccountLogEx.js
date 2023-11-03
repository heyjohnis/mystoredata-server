import soap from "soap"; // https://www.npmjs.com/package/soap
import { config } from "../../config.js";

(async () => {
  //const client = await soap.createClientAsync('https://testws.baroservice.com/BANKACCOUNT.asmx?WSDL') // 테스트서버
  const client = await soap.createClientAsync(
    "https://ws.baroservice.com/BANKACCOUNT.asmx?WSDL"
  ); // 운영서버

  // ---------------------------------------------------------------------------------------------------
  // API 레퍼런스 : https://dev.barobill.co.kr/docs/references/계좌조회-API#GetDailyBankAccountLogEx
  // ---------------------------------------------------------------------------------------------------
  const certKey = "EE712A1B-75C2-4A62-B75D-B61BC8B261E1";
  const corpNum = "6348702350";
  const id = "BETHELEAN";
  const bankAccountNum = "37691003114104";
  const baseDate = "20231031";
  const countPerPage = 100;
  const currentPage = 1;
  const orderDirection = 1;

  const response = await client.GetDailyBankAccountLogExAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    ID: id,
    BankAccountNum: bankAccountNum,
    BaseDate: baseDate,
    CountPerPage: countPerPage,
    CurrentPage: currentPage,
    OrderDirection: orderDirection,
  });

  const result = response[0].GetDailyBankAccountLogExResult;

  if (result.CurrentPage < 0) {
    // 호출 실패
    console.log(result.CurrentPage);
  } else {
    // 호출 성공
    console.log(result.CurrentPage);
    console.log(result.CountPerPage);
    console.log(result.MaxPageNum);
    console.log(result.MaxIndex);

    const bankAccountLogs = !result.BankAccountLogList
      ? []
      : result.BankAccountLogList.BankAccountLogEx;

    for (const bankAccountLog of bankAccountLogs) {
      // 필드정보는 레퍼런스를 참고해주세요.
      console.log(bankAccountLog);
    }
  }
})();
