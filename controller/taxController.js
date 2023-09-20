import * as taxService from "../service/taxService.js";

export async function regTaxScrap(req, res) {
  try {
    const data = await taxService.registTaxInvoiceScrapAsync(req);
    res.status(200).json(data);
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
