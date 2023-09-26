import TransModel from "../model/transModel.js";
import * as taxLogData from "./taxLogData.js";
import { FinClassCode, KoreanFamilyName } from "../cmmCode.js";

export async function updateFinClass(log) {
  const finClassCode = await resultFinClassCode(log);
  const finClassName = FinClassCode[finClassCode];
  return await TransModel.findOneAndUpdate(
    { _id: log._id },
    { $set: { finClassCode, finClassName } }
  );
}

export async function resultFinClassCode(log) {
  let code = log.transMoney > 0 ? "IN" : "OUT";
  const isTax = await taxLogData.isTaxRecipt(log);
  code += isTax ? "1" : isHumanName(log.transRemark) ? "2" : "3";
  return code;
}

function isHumanName(word) {
  if (!word) return false;
  return word?.length === 3 && KoreanFamilyName.includes(word[0]);
}
