import * as userData from "../data/userData.js";
import * as corpService from "../service/corpService.js";
import errorCase from "../middleware/baroError.js";

export async function getUserList(req, res) {
  const users = await userData.getUserList(req);
  res.status(200).json({ data: users, error: {} });
}

export async function updateUser(req, res) {
  try {
    const code = await corpService.updateBoroCorpInfo(req);
    if (code > 0) {
      const data = await userData.updateUser(req);
      res.status(200).json({ data, error: {} });
    } else {
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function resetCategory(req, res) {
  try {
    const data = await userData.resetCategory(req);
    res.status(200).json({ data, error: {} });
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function getCategory(req, res) {
  try {
    const data = await userData.getCategory(req);
    res.status(200).json({ data, error: {} });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

export async function getUserCategory(req, res) {
  try {
    const data = await userData.getUserCategory(req);
    res.status(200).json({ data, error: {} });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

export async function createCategoryRule(req, res) {
  try {
    const data = await userData.createCategoryRule(req);
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}
