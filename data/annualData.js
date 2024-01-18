import TransModel from "../model/transModel.js";
import AnnualModel from "../model/annualRule.js";

export async function getCategorySum(req) {
  try {
    const { userId, year } = req.body;
    return await TransModel.aggregate([
      {
        $match: {
          userId,
          transDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            useKind: "$useKind",
          },
          year: { $first: year },
          category: { $first: "$category" },
          categoryName: { $first: "$categoryName" },
          total: { $sum: "$transMoney" },
          userId: { $last: "$userId" },
          user: { $last: "$user" },
          useKind: { $last: "$useKind" },
          finClassCode: { $last: "$finClassCode" },
        },
      },
    ]);
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getAnnualYearData(req) {
  try {
    const { userId, year } = req.body;
    console.log({ userId, year });
    return await AnnualModel.findOne({ userId, year });
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function saveAnnualSum(req) {
  const { userId, year } = req.body;
  const data = await getCategorySum(req);
  console.log({ data });
  const IN1 = data.filter((item) => item.finClassCode === "IN1");
  const IN2 = data.filter((item) => item.finClassCode === "IN2");
  const IN3 = data.filter((item) => item.finClassCode === "IN3");
  const OUT1 = data.filter((item) => item.finClassCode === "OUT1");
  const OUT2 = data.filter((item) => item.finClassCode === "OUT2");
  const OUT3 = data.filter((item) => item.finClassCode === "OUT3");
  return await AnnualModel.updateOne(
    { userId, year },
    { category: data, IN1, IN2, IN3, OUT1, OUT2, OUT3 },
    { upsert: true }
  );
}
