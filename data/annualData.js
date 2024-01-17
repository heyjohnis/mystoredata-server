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
          finClass: { $last: "$finClassCode" },
        },
      },
    ]);
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function saveAnnualSum(req) {
  const { userId, year } = req.body;
  const data = await getCategorySum(req);
  return await AnnualModel.updateOne(
    { userId, year },
    { category: data },
    { upsert: true }
  );
}
