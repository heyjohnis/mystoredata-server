import * as service from "../service/accountService.js";
import errorCase from "../middleware/baroError.js";
import * as accountLogData from "../data/accountLogData.js";
import * as accountData from "../data/accountData.js";
import * as finItemData from "../data/finItemData.js";

export async function getAccounts(req, res) {
  try {
    const data = await service.getAccounts(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function regAcountLog(req, res) {
  try {
    const code = await service.regAcountLog(req);
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
  try {
    let code = await service.regAccount(req);
    console.log(errorCase(code));
    if (code < 0) code = await service.reRegAccount(req);
    if (code < 0) code = await service.cancelStopAccount(req);
    code = [-51004, -50225, -51005].includes(code) ? 1 : code;
    console.log("code: ", code);
    if (code > 0) {
      const corpNum = req.body.corpNum || req.corpNum;
      const user = req.body.user || req._id;
      const result = await accountData.regAccount(user, {
        ...req.body,
        corpNum,
      });

      console.log("regAccount: ", result);

      const registedFinItem = await finItemData.regFinItem(result);
      console.log("registedFinItem: ", registedFinItem);
      res.status(200).json(result);
    } else {
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function deleteAccount(req, res) {
  try {
    const code = await service.deleteAccount(req);
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
    const result = await accountData.updateAccount(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}
