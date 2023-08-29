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

export async function getKeywordCategoryRule(req, res) {
  try {
    const data = await ruleDate.getKeywordCategoryRule(req);
    res.status(200).json({ data, error: {} });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

export async function createResetCategoryRule(req, res) {
  try {
    const data = await ruleDate.createKeywordCategoryRule(req);
    res.status(200).json({ data, error: {} });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
