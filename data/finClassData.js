import TransModel from "../model/transModel.js";

export async function updateFinClass(log) {
  const finClassCode = "";
  const finClassName = "";
  return await TransModel.findOneAndUpdate(
    { _id: log._id },
    { $set: { finClassCode, finClassName } }
  );
}

function logicFinClass(log) {
  const income = log.transMoney > 0 ? "1" : "2";
  //   if (income === "1") {
  //     if("금융기관")
  //   }
}
