import e from "express";
import * as finItemData from "../data/finItemData.js";
import * as userData from "../data/userData.js";

export async function regFinItem(req, res) {
  try {
    const data = await finItemData.regFinItem(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function listFinItem(req, res) {
  try {
    res.status(200).json(await finItemData.listFinItem(req));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function updateFinItem(req, res) {
  try {
    const data = await finItemData.updateFinItem(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteFinItem(req, res) {
  try {
    const data = await finItemData.deleteFinItem(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
