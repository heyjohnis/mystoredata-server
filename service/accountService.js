import * as accountData from "../data/accountData.js";
import * as accountLogData from "../data/accountLogData.js";
import { keywordGen } from "../utils/keywordGen.js";
import errorCase from "../middleware/baroError.js";
import { BaroService } from "../utils/baroService.js";

const baroServiceName = "BANKACCOUNT";

export async function getAccounts(req) {
  const { corpNum, userId, opsKind } = req?.body || req?.query;
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
  const baroSvc = new BaroService(baroServiceName, "TEST");
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
  return response[0].RegistBankAccountResult;
}

export async function regBaraAccount(req) {
  const body = req.body;
  body.opsKind = "TEST";
  // Baro Test 계좌확인
  const accountList = await getAccounts(req);
  // Baro Test 서비스에 포함하고 있으면 처리 완료
  if (accountList.includes(req.body.bankAccountNum)) return "TEST";
  // Baro Test 서비스에 2개 이상시 OPS 서비스에 등록
  if (accountList.length > 1) {
    body.opsKind = "OPS";
    return await baroReRegAccount({ body });
  }
  // Baro Test 서비스에 1개 이하시 Baro Test 서비스에 등록
  return await baroReRegAccount(req);
}

async function baroReRegAccount(req) {
  const opsKind = req.body.opsKind;
  let code = await regAccount(req);
  if (code > 0) return opsKind; // 등록 성공
  code = await cancelStopAccount(req);
  if (code > 0) return opsKind; // 해지 취소 성공
  code = await reRegAccount(req);
  if (code > 0) return opsKind; // 재등록 성공
  return code;
}

export async function reRegAccount(req) {
  const { opsKind, corpNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.ReRegistBankAccountAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    BankAccountNum: req.body.bankAccountNum,
  });
  return response[0].ReRegistBankAccountResult;
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

export async function cancelStopAccount(req) {
  const { opsKind, corpNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.CancelStopBankAccountAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    BankAccountNum: req.body.bankAccountNum,
  });
  return response[0].CancelStopBankAccountResult;
}

export async function regAcountLog(req) {
  const { bankAccountNum, baseMonth, corpNum, userId } = req.body;
  const testService = new BaroService(baroServiceName, "TEST");
  const opsService = new BaroService(baroServiceName, "OPS");
  let isOps = false;
  const certKey = isOps ? opsService.certKey : testService.certKey;
  const client = isOps ? await opsService.client() : await testService.client();
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
  const { opsKind, corpNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.StopBankAccountAsync({
    CERTKEY: baroSvc.certKey,
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
