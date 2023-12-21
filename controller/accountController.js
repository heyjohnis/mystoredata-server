import * as service from "../service/accountService.js";
import errorCase from "../middleware/baroError.js";
import * as accountLogData from "../data/accountLogData.js";
import * as accountData from "../data/accountData.js";
import * as finItemData from "../data/finItemData.js";

export async function getAccounts(req, res) {
  try {
    const data = await service.getBaroAccountList(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function regAccountLog(req, res) {
  try {
    let code = await service.regAccountLog(req);
    const updatedAmount = await accountData.updateAccountAmount(req);
    console.log("updatedAmount: ", updatedAmount);
    if (code > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function getAccountLogs(req, res) {
  try {
    const logs = await accountLogData.getAccountLogs(req);
    res.status(200).json(logs);
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function regAccount(req, res) {
  const body = req.body;
  try {
    const opsKind = await service.regBaraAccount(req);
    // 오류코드가 존재하면 오류코드를 반환
    console.log("opsKind: ", opsKind, typeof opsKind);
    if (typeof opsKind === "number") {
      body.opsKind = "OPS";
    } else {
      body.opsKind = opsKind;
    }
    const result = await accountData.regAccount({ body });
    res.status(200).json(result);
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function baroRegAccount(req, res) {
  try {
    console.log("req.body: ", req.body);
    const code = await service.regAccount(req);
    console.log("code: ", errorCase(code));
    res.status(200).json(code);
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function stopAccount(req, res) {
  try {
    const code = await service.stopAccount(req);
    console.log("code: ", errorCase(code));
    if (code > 0) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}
export async function cancelStopAccount(req, res) {
  try {
    const code = await service.cancelStopAccount(req);
    console.log("code: ", errorCase(code));
    if (code > 0) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function reRegAccount(req, res) {
  try {
    const code = await service.reRegAccount(req);
    console.log("code: ", errorCase(code));
    if (code > 0) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function deleteAccount(req, res) {
  try {
    const code = await service.stopAccount(req);
    await accountData.deleteAccount(req);
    if (code > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function updateAccount(req, res) {
  try {
    console.log(req.body);
    const result = await accountData.updateAccount(req);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json(error);
  }
}
