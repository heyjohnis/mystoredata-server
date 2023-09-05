import FinItemtModel from "../model/finItemModel.js";
import { BankCorpCode, FinItemCode } from "../cmmCode.js";

export async function regFinItem(data) {
  const bankCode = BankCorpCode.find((item) => item.baro === data.bank);
  const itemCode = FinItemCode.find((item) => item.code === "CHKACC");
  const item = {
    user: data.user,
    userId: data.userId,
    account: data._id,
    itemKind: "ASSET",
    itemKindName: "자산",
    itemType: itemCode.code,
    itemTypeName: itemCode.name,
    itemName: "자유입출금 예금",
    finCorpCode: bankCode.code,
    finCorpName: bankCode.name,
    amount: 0,
  };

  console.log({ item });
  try {
    const finItem = await new FinItemtModel(item).save();
    console.log({ finItem });
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
