import FinItemtModel from "../model/finItemModel.js";

export async function regFinItem(data) {
  const inital = {
    itemKind: "ASSET",
    itemKindName: "자산",
    itemType: "checkingAccount",
    itemTypeName: "자유입출금 예금",
    itemName: "자유입출금 예금",
    amount: 0,
    account: data._id,
  };

  try {
    const finItem = await new FinItemtModel({ ...inital, ...data }).save();

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
