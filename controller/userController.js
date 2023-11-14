import * as userData from "../data/userData.js";
import * as corpService from "../service/corpService.js";
import errorCase from "../middleware/baroError.js";
import { registerCorpBaro } from "./authController.js";

export async function getUserList(req, res) {
  const users = await userData.getUserList(req);
  res.status(200).json({ data: users, error: {} });
}

export async function updateUser(req, res) {
  // Baro Update or Regist
  if (req.body.userType === "CORP") await registerCorpBaro(req);
  try {
    const data = await userData.updateUser(req);
    console.log("updateUser data: ", data);
    res.status(200).json(data);
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
    res.status(200).json(data);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error });
  }
}

export async function getUserCategory(req, res) {
  try {
    const data = await userData.getUserCategory(req);
    res.status(200).json(data);
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
