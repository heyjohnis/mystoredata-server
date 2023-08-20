import TransModel from "../model/transModel.js";

export async function mergeTransMoney(asset) {
  const transAsset = setTransAsset(asset);

  const assets = await TransModel.find({
    corpNum: transAsset.corpNum,
    transMoney: transAsset.transMoney,
  });
  const duplAsset = assets.find(
    (regAsset) => Math.abs(regAsset.transDate - asset.transDate) < 100000
  );

  if (duplAsset) {
    const mergedLog = await TransModel.updateOne(
      { _id: duplAsset._id },
      { $set: transAsset }
    );
    console.log("assets mergedLog", mergedLog);
  } else {
    await TransModel.create(transAsset);
  }
}

function setTransAsset(asset) {
  const assetNum = asset.cardNum || asset.BankAccountNum;
  const transMoney =
    parseInt(asset.CardApprovalCost || 0) * -1 ||
    parseInt(asset.Deposit) ||
    parseInt(asset.Withdraw) * -1;
  const cardData = {
    user: asset.user,
    corpNum: asset.CorpNum,
    corpName: asset.CorpName,
    cardNum: asset.CardNum,
    assetNum,
    transDate: asset.transDate,
    cardCompany: asset.cardCompany,
    cardApprovalType: asset.CardApprovalType,
    cardApprovalCost: asset.CardApprovalNum,
    serviceCharge: asset.ServiceCharge,
    amount: asset.Amount,
    tax: asset.Tax,
    totalAmount: asset.TotalAmount,
    useStoreNum: asset.UseStoreNum,
    useStoreCorpNum: asset.UseStoreCorpNum,
    useStoreName: asset.UseStoreName,
    useStoreAddr: asset.UseStoreAddr,
    useStoreBizType: asset.UseStoreBizType,
    useStoreTel: asset.UseStoreTel,
    useStoreTaxType: asset.UseStoreTaxType,
    paymentPlan: asset.PaymentPlan,
    currency: asset.Currency,
    transMoney,
  };

  const accountData = {
    user: asset.user,
    corpNum: asset.CorpNum,
    corpName: asset.CorpName,
    bankAccountNum: asset.BankAccountNum,
    transDate: asset.transDate,
    bank: asset.bank,
    transMoney,
    transType: asset.TransType,
    transOffice: asset.TransOffice,
    transRemark: asset.TransRemark,
    transRefKey: asset.TransRefKey,
    mgtRemark1: asset.MgtRemark1,
    mgtRemark2: asset.MgtRemark2,
  };

  return asset.CardNum ? cardData : accountData;
}

export async function getTransMoney(req) {
  const filter = req.query.corpNum ? { corpNum: req.query.corpNum } : {};
  return TransModel.find(filter).sort({ transDate: -1 });
}
