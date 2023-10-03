import * as finStatusData from "../data/finStatusData.js";

export async function getFinStatusAmountData(req, res) {
  try {
    const data = await finStatusData.getFinStatusAmountData(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
