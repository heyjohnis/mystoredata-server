import TransModel from '../model/transModel';

export async function mergeTransMoney( asset ) {

    const transAsset = setTransAsset(asset);

    const assets = await TransModel.find({
        corpNum, 
        transMoney: transAsset.transMoney, 
        assetNum: transAsset.transMoney
    });    
    const duplAsset = assets.find( regAsset => Math.abs(regAsset.transDate - asset.transDate) < 100000 );
    console.log("assets duplicated asset");

    if(duplAsset) {

    }
}

function setTransAsset( asset ) {
    const assetNum = asset.cardNum || asset.BankAccountNum;

    const transMoney = parseInt(asset.CardApprovalCost || 0) 
        || parseInt(asset.Deposit) * -1 
        || parseInt(asset.Withdraw); 

    return {
        user: asset.user,
        corpNum: asset.corpNum,
        corpName: asset.CorpName,
        assetNum,
        transDate: asset.transDate,
        cardCompany: asset.cardCompany,
        cardApprovalType: asset.CardApprovalType,
        cardApprovalCost: asset.CardApprovalNum,
        serviceCharge: asset.ServiceCharge,
        useStoreNum: asset.UseStoreNum,
        useStoreCorpNum: asset.UseStoreCorpNum,
        useStoreName: asset.UseStoreName,
        useStoreAddr: asset.UseStoreAddr,
        useStoreBizType: asset.UseStoreBizType,
        useStoreTel: asset.UseStoreTel,
        useStoreTaxType: asset.UseStoreTaxType,
        paymentPlan: asset.PaymentPlan,
        currency: asset.Currency,
        bank: asset.bank,
        transMoney,
        transType: asset.TransType,
        transOffice: asset.TransOffice,
        transRemark: asset.TransRemark,
        transRefKey: asset.TransRefKey,
        mgtRemark1: asset.MgtRemark1,
        mgtRemark2: asset.MgtRemark2,
    }
}