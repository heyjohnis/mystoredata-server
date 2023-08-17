import UserModel from '../model/userModel.js';
import CardModel from '../model/cardModel.js';

export async function getCardList ( _id ) {
  return UserModel.findOne({ _id });
}

export async function getCard ( bankAccountNum ) {
  return CardModel.findOne({ bankAccountNum });
}

export async function regCard(_id, newCard ) {
  const userInfo = await UserModel.findOne({_id});
  console.log("hasCard", userInfo);
  const cards = userInfo?.cards;  
  const hasCard = cards.find( card => card.cardNum === newCard.cardNum);
  if(!hasCard) {
    await new CardModel({...newCard, user: userInfo._id, corpName: userInfo.corpName, userId: userInfo.userId}).save();
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



