import soap from "soap";
import { config } from "../config.js";
import * as accountData from "../data/accountData.js";
import * as accountLogData from "../data/accountLogData.js";
import { keywordGen } from "../utils/keywordGen.js";
import errorCase from "../middleware/baroError.js";

const certKey = config.baro.certKey;
// const client = await soap.createClientAsync('https://testws.baroservice.com/BANKACCOUNT.asmx?WSDL') // 테스트서버
const client = await soap.createClientAsync(
  "https://ws.baroservice.com/BANKACCOUNT.asmx?WSDL"
); // 운영서버

// 계좌조회 : https://dev.barobill.co.kr/docs/references/계좌조회-API#GetBankAccountEx
export async function getAccounts(req) {
  const availOnly = 1;
  const response = await client.GetBankAccountExAsync({
    CERTKEY: certKey,
    CorpNum: req.corpNum,
    AvailOnly: availOnly,
  });

  const result = response[0].GetBankAccountExResult;

  if (result && /^-[0-9]{5}$/.test(result.BankAccount[0].BankAccountNum)) {
    // 호출 실패
    console.log(result.BankAccount[0].BankAccountNum);
  } else {
    // 호출 성공
    const bankAccounts = !result ? [] : result.BankAccount;
    for (const bankAccount of bankAccounts) {
      console.log(bankAccount);
    }
    return bankAccounts;
  }
}

export async function regAccount(req) {
  const corpNum = req.body.corpNum || req.corpNum;
  const {
    bank,
    bankAccountType,
    bankAccountNum,
    bankAccountPwd,
    webId,
    webPwd,
    birth,
  } = req.body;
  const reqBaro = {
    CERTKEY: certKey,
    CorpNum: corpNum,
    CollectCycle: "HOUR4",
    Bank: bank,
    BankAccountType: bankAccountType,
    BankAccountNum: bankAccountNum,
    BankAccountPwd: bankAccountPwd,
    WebId: webId || "",
    WebPwd: webPwd || "",
    IdentityNum: bankAccountType === "C" ? corpNum || "" : birth || "",
    Alias: "",
    Usage: "",
  };

  console.log({ reqBaro });
  const response = await client.RegistBankAccountAsync(reqBaro);

  return response[0].RegistBankAccountResult;
}

export async function reRegAccount(req) {
  const response = await client.ReRegistBankAccountAsync({
    CERTKEY: certKey,
    CorpNum: req.body.corpNum || req.corpNum,
    BankAccountNum: req.body.bankAccountNum,
  });
  return response[0].ReRegistBankAccountResult;
}

export async function cancelStopAccount(req) {
  const response = await client.CancelStopBankAccountAsync({
    CERTKEY: certKey,
    CorpNum: req.body.corpNum || req.corpNum,
    BankAccountNum: req.body.bankAccountNum,
  });
  return response[0].CancelStopBankAccountResult;
}

export async function regAcountLog(req) {
  const { bankAccountNum, baseMonth, corpNum, userId } = req.body;

  const reqBaro = {
    CERTKEY: certKey,
    CorpNum: corpNum || req.corpNum,
    ID: userId || req.userId,
    BankAccountNum: bankAccountNum,
    BaseMonth: baseMonth,
    CountPerPage: 100,
    OrderDirection: 1,
  };
  let currentPage = 1;
  let is100p = true;
  let cntLog = 0;
  while (is100p) {
    reqBaro.CurrentPage = currentPage++;
    const response = await client.GetMonthlyBankAccountLogExAsync(reqBaro);
    const result = response[0].GetMonthlyBankAccountLogExResult;
    if (result.CurrentPage < 0) {
      console.log("CurrentPage: ", errorCase(result.CurrentPage));
      // 호출 실패
      return result.CurrentPage;
    } else {
      // 호출 성공
      const account = await accountData.getAccount(bankAccountNum);
      const logs = !result.BankAccountLogList
        ? []
        : result.BankAccountLogList.BankAccountLogEx;
      console.log("cntLog: ", cntLog, "page", currentPage);
      is100p = logs.length === 100;
      for (let i = 0; i < logs.length; i++) {
        const words = `${logs[i].TransRemark}`;
        const keyword = await keywordGen(words);
        console.log("keyword: ", keyword);

        await accountLogData.regAccountLog({
          user: account.user,
          userId: account.userId,
          bank: account.bank,
          corpNum: account.corpNum,
          corpName: account.corpName,
          account: account._id,
          useKind: account.useKind,
          bankAccountNum: account.bankAccountNum,
          withdraw: logs[i].Withdraw,
          deposit: logs[i].Deposit,
          balance: logs[i].Balance,
          transDT: logs[i].TransDT,
          transOffice: logs[i].TransOffice,
          transRemark: logs[i].TransRemark,
          transRefKey: logs[i].TransRefKey,
          mgtRemark1: logs[i].MgtRemark1,
          mgtRemark2: logs[i].MgtRemark2,
          keyword,
        });
        cntLog++;
      }
    }
  }
  return cntLog;
}

export async function deleteAccount(req) {
  const { account } = req.params;
  const response = await client.StopBankAccountAsync({
    CERTKEY: certKey,
    CorpNum: req.body.corpNum || req.corpNum,
    account,
  });
  const resultCode = response[0].StopBankAccountResult;
  const result = await accountData.deleteAccount(req);
  console.log("delete account: ", result);

  if (resultCode < 0) {
    // 호출 실패
    return resultCode;
  } else {
    // 호출 성공
  }
}
