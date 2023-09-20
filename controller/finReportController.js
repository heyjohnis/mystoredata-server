import * as finReportData from "../data/finReportData.js";

export async function getCategoryReportData(req, res) {
  try {
    const data = await finReportData.getCategoryReportData(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
