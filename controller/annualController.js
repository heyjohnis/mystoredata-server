import * as annualData from "../data/annualData.js";

export async function getCategorySum(req, res) {
  try {
    const data = await annualData.getCategorySum(req);
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
export async function saveAnnualSum(req, res) {
  try {
    const data = await annualData.saveAnnualSum(req);
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
