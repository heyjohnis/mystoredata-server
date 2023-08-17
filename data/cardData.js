import UserModel from '../model/userModel.js';
import CardModel from '../model/cardModel.js';

export async function getCardList ( _id ) {
  return UserModel.findOne({ _id });
}

export async function getCard ( cardNum ) {
  console.log("cardNum", cardNum);
  return CardModel.findOne({ cardNum });
}

export async function regCard(_id, newCard ) {
  const userInfo = await UserModel.findOne({_id});
  const cards = userInfo?.cards;  
  const hasCard = cards.find( card => card.cardNum === newCard.cardNum);
  console.log("hasCard", hasCard);
  if(!hasCard) {
    console.log("newcard", {...newCard, corpNum: userInfo.corpNum, user: userInfo._id, corpName: userInfo.corpName, userId: userInfo.userId});
    await new CardModel({...newCard, corpNum: userInfo.corpNum, user: userInfo._id, corpName: userInfo.corpName, userId: userInfo.userId}).save();
    return  await UserModel.findByIdAndUpdate(_id, { $push: { cards: newCard }}, { returnOriginal: false });
  }
}

export async function deleteCard ( _id, cardNum ) {
  console.log(_id, cardNum);
  await CardModel.deleteOne({ cardNum, user: _id });
  return await UserModel.updateOne(
    { _id }, 
    { $pull: { cards: { cardNum } } }
  );
}



