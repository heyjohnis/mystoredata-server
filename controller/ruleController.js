import * as transData from "../data/transData.js";
import * as ruleDate from "../data/ruleData.js";

export async function mergeTransLogs(req, res) {
  const data = await transData
    .getTransMoney(req)
    .catch((error) => console.log(error));
  res.status(200).json({ data, error: {} });
}

export async function getCategoryRule(req, res) {
  try {
    const data = await ruleDate.getCategoryRule(req);
    res.status(200).json({ data, error: {} });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
