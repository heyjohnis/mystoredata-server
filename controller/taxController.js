import * as taxService from "../service/taxService.js";
import * as userData from "../data/userData.js";
import * as taxData from "../data/taxLogData.js";
import errorCase from "../middleware/baroError.js";
import { nowDate } from "../utils/date.js";

export async function regTaxScrap(req, res) {
  try {
    const resCode = await taxService.registTaxInvoiceScrapAsync(req);

    const regHomeTax = await userData.updateUserHometaxInfo(req);
    console.log("regHomeTax: ", regHomeTax);

    res.status(200).json(errorCase(resCode));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

/* 홈택스 재등록 */
export async function reRegTaxScrap(req, res) {
  try {
    const resCode = await taxService.ReRegistTaxInvoiceScrapAsync(req);
    console.log("resCode: ", resCode);
    res.status(200).json(errorCase(resCode));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function regTaxLog(req, res) {
  let cntSales = 0;
  let cntPurchase = 0;
  try {
    const homeTaxUsers = await userData.getHomeTaxUsers();
    const fromAt =
      req.body.fromAt ||
      (new Date().toISOString().slice(0, 7) + "-01").replaceAll("-", "");
    const toAt =
      req.body.toAt ||
      new Date().toISOString().slice(0, 10).replaceAll("-", "");
    for (const user of homeTaxUsers) {
      user.fromAt = fromAt;
      user.toAt = toAt;
      user.user = user._id;
      console.log("user: ", user.userId, user.userName, user.fromAt, user.toAt);
      const body = { corpNum: user.corpNum };
      const cancelCode = await taxService.cancelStopTaxInvoiceScrapAsync({
        body,
      });
      console.log("홈택스 해지 취소 : ", errorCase(cancelCode));

      const reRegCode = await taxService.ReRegistTaxInvoiceScrapAsync({ body });
      console.log("홈택스 사용 재등록 : ", errorCase(reRegCode));
      cntSales +=
        (await taxService.getPeriodTaxInvoiceSalesListAsync(user)) || 0;
      cntPurchase +=
        (await taxService.getPeriodTaxInvoicePurchaseListAsync(user)) || 0;
      await taxData.notUseCanceledTaxLog(user);
    }
    res.status(200).json(cntSales + cntPurchase);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getTaxLogs(req, res) {
  try {
    const data = await taxData.getTaxLogs(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function isTaxReciptLog(req, res) {
  const log = req.body;
  try {
    const data = await taxData.isTaxRecipt(log);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
