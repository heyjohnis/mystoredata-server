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
  const {
    user,
    cardNum,
    cardCompany,
    cardType,
    tradeKind,
    webId,
    webPwd,
    useKind,
    opsKind,
  } = req.body;

  const userInfo = await UserModel.findOne({ _id: user });
  const cards = userInfo.cards;
  const { _id, userId, corpNum, corpName } = userInfo;
  const hasCard = cards.find((card) => card.cardNum === cardNum);
  if (!hasCard) {
    const registedCard = await new CardModel({
      user: _id,
      userId,
      corpNum,
      corpName,
      cardNum: cardNum || "",
      cardCompany: cardCompany || "",
      cardType: cardType || "",
      tradeKind,
      webId: webId || "",
      webPwd: webPwd || "",
      useKind: useKind || "PERSONAL",
      opsKind,
    }).save();
    console.log("registedCard: ", registedCard);
    await UserModel.findByIdAndUpdate(
      _id,
      { $push: { cards: registedCard } },
      { returnOriginal: false }
    );
    return registedCard;
  }
  return;
}

export async function deleteCard(req) {
  const { _id } = req.params;
  const { user } = req.body;
  await CardModel.findOneAndDelete({ _id });
  return await UserModel.updateOne(
    { _id: user },
    { $pull: { cards: { _id } } }
  );
}

export async function updateCard(req) {
  const { cardNum, useKind, tradeKind } = req.body;
  await CardModel.updateOne({ cardNum }, { $set: { ...req.body } });
  return await UserModel.updateOne(
    { "cards.cardNum": cardNum },
    {
      $set: {
        "cards.$.useKind": useKind,
        "cards.$.tradeKind": tradeKind,
      },
    }
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
