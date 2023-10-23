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

export async function getFinStatusTaxData(req, res) {
  try {
    const data = await finStatusData.getFinStatusTaxData(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getFinStatusAccountData(req, res) {
  try {
    const data = await finStatusData.getFinStatusAccountData(req);
    console.log("data: ", data);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getFinStatusAssetData(req, res) {
  try {
    const data = await finStatusData.getFinStatusAssetData(req);
    console.log("getFinStatusAssetData: ", data);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getFinStatusDebtData(req, res) {
  try {
    const data = await finStatusData.getFinStatusDebtData(req);
    console.log("getFinStatusDebtData: ", data);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
