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
  try {
    const code = await service.regBaraAccount(req);
    if (code > 0) {
      await accountData.regAccount(req);
    }
    res.status(200).json(result);
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

// export async function regAccount(req, res) {
//   // 등록된 계좌 확인
//   const body = req.body;
//   try {
//     body.baroKind = "TEST";
//     const baraAccountList = await service.getAccounts({ body });
//     // Baro Test 서비스에 2개 이상 등록되었는지 확인
//     if (baraAccountList.length > 1) {
//       body.baroKind = "OPS";
//     }
//   } catch (error) {
//     res.sendStatus(500).json(error);
//   }

//   try {
//     let code = await service.regAccount({ body });
//     console.log(errorCase(code));
//     if (code < 0) code = await service.reRegAccount(req);
//     if (code < 0) code = await service.cancelStopAccount(req);
//     code = [-51004, -50225, -51005].includes(code) ? 1 : code;
//     console.log("code: ", code);
//     if (code > 0) {
//       const corpNum = req.body.corpNum || req.corpNum;
//       const user = req.body.user || req._id;
//       const result = await accountData.regAccount(user, {
//         ...req.body,
//         corpNum,
//       });
//       res.status(200).json(result);
//     } else {
//       res.status(400).json(errorCase(code));
//     }
//   } catch (error) {
//     res.sendStatus(500).json(error);
//   }
// }

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
    const result = await accountData.updateAccount(req);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json(error);
  }
}
