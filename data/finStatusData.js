import TransModel from "../model/transModel.js";
import { strToDate } from "../utils/date.js";

export async function getFinStatusAmountData(req) {
  const { userId, fromAt, toAt } = req.body;
  try {
    const amount = await TransModel.aggregate([
      {
        $match: {
          userId,
          transDate: {
            $gte: strToDate(fromAt),
            $lte: strToDate(toAt),
          },
        },
      },
      {
        $group: {
          _id: "$finClassCode",
          amount: { $sum: "$transMoney" },
        },
      },
    ]);
    return amount;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
