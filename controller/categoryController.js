import * as categoryDate from "../data/categoryData.js";

export async function getKeywordCategoryRule(req, res) {
  try {
    const data = await categoryDate.getKeywordCategoryRule(req);
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

export async function updateKeywordCategoryRule(req, res) {
  try {
    const data = await categoryDate.updateKeywordCategoryRule(req);
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

export async function keywordCategory(req, res) {
  try {
    const data = await categoryDate.keywordCategory(req);
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

export async function getNonCategory(req, res) {
  try {
    const data = await categoryDate.getNonCategory(req);
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
