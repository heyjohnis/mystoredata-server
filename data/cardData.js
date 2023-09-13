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

export async function regCard(req) {
  console.log("regCard: ", req?.body || req);
  const {
    user,
    userId,
    cardNum,
    corpNum,
    corpName,
    cardCompany,
    cardType,
    webId,
    webPwd,
    useKind,
  } = req?.body || req;

  const hasCard = CardModel.findOne((card) => card.cardNum === cardNum);
  if (!hasCard) {
    const regedCard = await new CardModel({
      user,
      userId,
      cardNum,
      corpNum,
      corpName,
      cardCompany,
      cardType,
      webId,
      webPwd,
      useKind,
    }).save();
    return await UserModel.findByIdAndUpdate(
      _id,
      {
        $push: { cards: regedCard },
      },
      { returnOriginal: false }
    );
  }
}

export async function deleteCard(req) {
  const _id = req.params._id;
  const deletedCard = await CardModel.findOneAndDelete({ _id });
  return await UserModel.updateOne(
    { _id: deletedCard.user },
    { $pull: { cards: { _id } } }
  );
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
