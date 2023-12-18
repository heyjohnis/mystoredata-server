import EmpModel from "../model/empModel.js";
import { assetFilter } from "../utils/filter.js";

export async function regEmployeeInfo(req) {
  try {
    const hasEmp = await getEmployeeInfo(req.body);
    if (hasEmp) {
      return hasEmp;
    }
    const { user, userId, corpNum, corpName, transRemark, transMoney } =
      req.body;
    const emp = new EmpModel({
      user,
      userId,
      corpNum,
      corpName,
      empName: transRemark,
      transRemark,
      recentPay: Math.abs(transMoney),
    }).save();
    return emp;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getEmployeeInfo(log) {
  const { userId, transRemark } = log;
  return EmpModel.findOne({ userId, transRemark: transRemark });
}

export async function getEmployeeList(req) {
  const filter = assetFilter(req);
  return EmpModel.find(filter);
}

export async function deleteEmployeeNotUse(req) {
  const { userId } = req.body;

  const notUseData = await EmpModel.aggregate([
    {
      $lookup: {
        from: "transmoneys",
        localField: "_id",
        foreignField: "employee",
        as: "joinedData",
      },
    },
    {
      $addFields: {
        count: { $size: "$joinedData" },
      },
    },
    {
      $match: {
        count: 0,
        userId,
      },
    },
  ]);

  notUseData.forEach(async (data) => {
    await EmpModel.findByIdAndDelete(data._id);
  });

  return notUseData;
}
