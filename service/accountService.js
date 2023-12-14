import * as accountData from "../data/accountData.js";
import * as accountLogData from "../data/accountLogData.js";
import { keywordGen } from "../utils/keywordGen.js";
import errorCase from "../middleware/baroError.js";
import { BaroService } from "../utils/baroService.js";

const baroServiceName = "BANKACCOUNT";

export async function getBaroAccountList(req) {
  const { corpNum, opsKind } = req?.body || req?.query;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();
  const response = await client.GetBankAccountExAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum,
    AvailOnly: 1,
  });

  const result = response[0].GetBankAccountExResult;
  if (result && /^-[0-9]{5}$/.test(result.BankAccount[0].BankAccountNum)) {
    // 호출 실패
    console.log(
      "GetBankAccountExResult: ",
      errorCase(result.BankAccount[0].BankAccountNum)
    );
  } else {
    // 호출 성공
    const bankAccounts = !result ? [] : result.BankAccount;
    console.log("GetBankAccountExAsync: ", bankAccounts);
    return bankAccounts;
  }
}

export async function regAccount(req) {
  const {
    bank,
    bankAccountType,
    bankAccountNum,
    bankAccountPwd,
    webId,
    webPwd,
    birth,
    opsKind,
  } = req.body;
  const corpNum = req.body.corpNum || req.corpNum;
  const baroSvc = new BaroService(baroServiceName, opsKind || "TEST");
  const client = await baroSvc.client();
  const reqBaro = {
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum,
    CollectCycle: "DAY1",
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
  const response = await client.RegistBankAccountAsync(reqBaro);
  const code = response[0].RegistBankAccountResult;
  console.log("RegistBankAccountAsync: ", errorCase(code));
  return code;
}

export async function regBaraAccount(req) {
  const body = req.body;
  body.opsKind = "TEST";
  // Baro Test 계좌확인
  const accountList = await getBaroAccountList(req);
  // Baro Test 서비스에 포함하고 있으면 처리 완료
  const hasAccount = accountList.find(
    (account) => account.BankAccountNum === req.body.bankAccountNum
  );
  if (hasAccount) return "TEST";
  // Baro Test 서비스에 2개 이상시 OPS 서비스에 등록
  if (accountList.length > 1) {
    body.opsKind = "OPS";
    const code = await baroReRegAccount({ body });
    console.log("baroReRegAccount: ", errorCase(code));
    return code;
  }
  // Baro Test 서비스에 1개 이하시 Baro Test 서비스에 등록
  const code = await baroReRegAccount(req);
  if (typeof code === "number") {
    body.opsKind = "OPS";
    const code = await baroReRegAccount({ body });
  }
  return code;
}

async function hasBaroAccount(req) {
  const accountList = await getBaroAccountList(req);
  console.log("accountList: ", accountList);
  // Baro Test 서비스에 포함하고 있으면 처리 완료
  const hasAccount = accountList.find(
    (account) => account.BankAccountNum === req.body.bankAccountNum
  );
  return hasAccount;
}

async function baroReRegAccount(req) {
  const opsKind = req.body.opsKind;
  let code = await regAccount(req);
  console.log("regAccount: ", errorCase(code));
  if (code > 0) return opsKind; // 등록 성공

  code = await cancelStopAccount(req);
  console.log("cancelStopAccount: ", errorCase(code));
  if (code > 0) return opsKind; // 해지 취소 성공

  code = await reRegAccount(req);
  console.log("reRegAccount: ", errorCase(code));
  if (code > 0) return opsKind; // 재등록 성공
  return code;
}

export async function reRegAccount(req) {
  const { opsKind, corpNum, bankAccountNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.ReRegistBankAccountAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    BankAccountNum: bankAccountNum,
  });
  return response[0].ReRegistBankAccountResult;
}

export async function cancelStopAccount(req) {
  const { opsKind, corpNum, bankAccountNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.CancelStopBankAccountAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    BankAccountNum: bankAccountNum,
  });
  return response[0].CancelStopBankAccountResult;
}

export async function regAccountLog(req) {
  // 수집하기 전에 해지여부 확인 후 진행, 해지되었을 시 해지취소 후 수집
  const hasAccount = await hasBaroAccount(req);
  if (!hasAccount) {
    // 계좌 해지 취소
    let code = await cancelStopAccount(req);
    console.log("cancelStopAccount: ", errorCase(code));
    if (code === -51005) code = await reRegAccount(req);
    console.log("reRegAccount: ", errorCase(code));
    if (code === -26006) {
      req.body.opsKind = "OPS";
      const result = await accountData.updateAccount(req);
      console.log("updateAccount: ", result?.n);
      code = await baroReRegAccount(req);
      console.log("운영 ReRegAccount: ", errorCase(code));
    }
  }
  const { bankAccountNum, baseMonth, corpNum, userId, opsKind } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();
  const reqBaro = {
    CERTKEY: baroSvc.certKey,
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
      for (let log of logs) {
        const words = `${log.TransRemark}`;
        const keyword = await keywordGen(words);
        await accountLogData.regAccountLog({
          user: account.user,
          userId: account.userId,
          bank: account.bank,
          corpNum: account.corpNum,
          corpName: account.corpName,
          account: account._id,
          useKind: account.useKind,
          bankAccountNum: account.bankAccountNum,
          withdraw: log.Withdraw,
          deposit: log.Deposit,
          balance: log.Balance,
          transDT: log.TransDT,
          transType: log.TransType,
          transOffice: log.TransOffice,
          transRemark: log.TransRemark,
          transRefKey: log.TransRefKey,
          mgtRemark1: log.MgtRemark1,
          mgtRemark2: log.MgtRemark2,
          keyword,
        });
        cntLog++;
        console.log("cntLog: ", cntLog);
      }
    }
  }
  return cntLog;
}

export async function stopAccount(req) {
  const { opsKind, corpNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.StopBankAccountAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    BankAccountNum: req.body.bankAccountNum,
  });
  return response[0].StopBankAccountResult;
}
