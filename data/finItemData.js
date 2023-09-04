import FinItemtModel from "../model/finItemModel.js";

export async function regFinItem(data) {
  try {
    const finItem = await new FinItemtModel({ ...data }).save();

    return finItem;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function listFinItem(req) {
  try {
    const { user, userId } = req.query;
    const query = {};
    if (user) query.user = user;
    if (userId) query.userId = userId;
    const finItems = await FinItemtModel.find(query).sort({ itemName: 1 });
    console.log({ finItems });
    return finItems;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}
