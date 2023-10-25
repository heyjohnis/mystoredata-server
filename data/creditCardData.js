import CreditCardModel from "../model/creditCardModel.js";
import { assetFilter } from "../utils/filter.js";

export async function regCreditCardInfo(req) {
  const {
    user,
    userId,
    corpNum,
    corpName,
    finName,
    finItemCode,
    finItemName,
    card,
    cardNum,
    transRemark,
  } = req.body;

  try {
    const creditCard = new CreditCardModel({
      user,
      userId,
      corpNum,
      corpName,
      finItemCode,
      finItemName,
      finName,
      card,
      cardNum,
      transRemark,
    }).save();
    return creditCard;
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

export async function getCreditCardList(req) {
  const filter = assetFilter(req);
  return CreditCardModel.find(filter);
}

export async function getCreditCardInfo(req) {
  const { userId, cardNum } = req.body;
  return await CreditCardModel.findOne({ userId, cardNum });
}
