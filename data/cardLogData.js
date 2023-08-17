import CardLogModel from '../model/cardLogModel.js';

export async function regCardLog ( data ) {
  const { CorpNum, CardNum, CardApprovalCost, UseStoreNum, UseDT } = data;
  try {
    const existingData = await CardLogModel.findOne({
      CorpNum,
      CardNum,
      CardApprovalCost,
      UseStoreNum,
      UseDT,
    });

    console.log("existingData", existingData);

    if (!existingData) {
      await new CardLogModel(data).save();
    }
  } catch (error) {
    throw error;
  }
}

export async function getCardLogs ( data ) {
  return CardLogModel.find().sort({ createdAt: -1 });
}


