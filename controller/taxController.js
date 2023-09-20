import * as taxService from "../service/taxService.js";
import * as userData from "../data/userData.js";
import errorCase from "../middleware/baroError.js";

export async function regTaxScrap(req, res) {
  try {
    const resCode = await taxService.registTaxInvoiceScrapAsync(req);

    userData.updateUserHometaxInfo(req);

    res.status(200).json(errorCase(resCode));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getTaxList(req, res) {
  try {
    const data = await taxService.getPeriodTaxInvoiceSalesListAsync(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
