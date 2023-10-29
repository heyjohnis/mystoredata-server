import * as empData from "../data/empData.js";
import * as transData from "../data/transData.js";

export async function regEmployeeInfo(req, res) {
  try {
    const empDataInfo = await empData.regEmployeeInfo(req);
    const updatedData = await transData.updateTransMoneyForEmployee(
      req,
      empDataInfo
    );
    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getEmployeeList(req, res) {
  try {
    const emps = await empData.getEmployeeList(req);
    res.status(200).json(emps);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteEmployeeNotUse(req, res) {
  try {
    const emps = await empData.deleteEmployeeNotUse(req);
    res.status(200).json(emps);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
