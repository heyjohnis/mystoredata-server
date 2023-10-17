import * as tradCorpData from "../data/tradeCorpData.js";
import { nowDate } from "../utils/date.js";

export async function getTradeCorpList(req, res) {
  try {
    const tradeCorpList = await tradCorpData.getTradeCorpList(req.body);
    res.status(200).json(tradeCorpList);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
