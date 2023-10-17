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
