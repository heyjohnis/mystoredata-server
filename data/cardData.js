import UserModel from "../model/userModel.js";
import CardModel from "../model/cardModel.js";
import { assetFilter } from "../utils/filter.js";

export async function getCardList(req) {
  const filter = assetFilter(req);
  return CardModel.find(filter);
}

export async function getCard(cardNum) {
  console.log("cardNum", cardNum);
  return CardModel.findOne({ cardNum });
}

export async function regCard(_id, newCard) {
  const userInfo = await UserModel.findOne({ _id });
  const cards = userInfo?.cards;
  const hasCard = cards.find((card) => card.cardNum === newCard.cardNum);
  if (!hasCard) {
    console.log("newcard", {
      ...newCard,
      corpNum: userInfo.corpNum,
      user: userInfo._id,
      corpName: userInfo.corpName,
      userId: userInfo.userId,
    });
    await new CardModel({
      ...newCard,
      corpNum: userInfo.corpNum,
      user: userInfo._id,
      corpName: userInfo.corpName,
      userId: userInfo.userId,
    }).save();
    return await UserModel.findByIdAndUpdate(
      _id,
      { $push: { cards: newCard } },
      { returnOriginal: false }
    );
  }
}

export async function deleteCard(_id, cardNum) {
  console.log(_id, cardNum);
  await CardModel.deleteOne({ cardNum, user: _id });
  return await UserModel.updateOne({ _id }, { $pull: { cards: { cardNum } } });
}

export async function updateCard(card) {
  await CardModel.updateOne({ cardNum: card.cardNum }, { $set: { ...card } });
  return await UserModel.updateOne(
    { "cards.cardNum": card.cardNum },
    { "cards.$.useKind": card.useKind }
  );
}

export async function updateAccount(account) {
  await AccountModel.updateOne(
    { bankAccountNum: account.bankAccountNum },
    { $set: { ...account } }
  );
  return await UserModel.updateOne(
    { "accounts.bankAccountNum": account.bankAccountNum },
    { "accounts.$.useKind": account.useKind }
  );
}
