import soap from "soap"; // https://www.npmjs.com/package/soap
import mecab from "mecab-ya";
import * as cardData from "../data/cardData.js";
import * as cardLogData from "../data/cardLogData.js";
import { config } from "../config.js";
import errorCase from "../middleware/baroError.js";
import { keywordGen } from "../utils/keywordGen.js";
const certKey = config.baro.certKey;

//const client = await soap.createClientAsync('https://testws.baroservice.com/CARD.asmx?WSDL') // 테스트서버
const client = await soap.createClientAsync(
  "https://ws.baroservice.com/CARD.asmx?WSDL"
); // 운영서버

export async function regCard(req) {
  const corpNum = req.body.corpNum || req.corpNum;
  const { cardCompany, cardType, cardNum, webId, webPwd } = req.body;
  const alias = "";
  const usage = "";

  const response = await client.RegistCardAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    CardCompany: cardCompany,
    CardType: cardType,
    CardNum: cardNum,
    WebId: webId,
    WebPwd: webPwd,
    Alias: alias,
    Usage: usage,
  });

  return response[0].RegistCardResult;
}

export async function stopCard(req, res) {
  const { cardNum, corpNum } = req.body;

  const response = await client.StopCardAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    CardNum: cardNum,
  });

  return response[0].StopCardResult;
}

export async function getCardList(req, res) {
  const corpNum = req.corpNum;
  const availOnly = 1;

  const response = await client.GetCardExAsync({
    CERTKEY: certKey,
    CorpNum: corpNum,
    AvailOnly: availOnly,
  });

  const result = response[0].GetCardExResult;

  if (result && /^-[0-9]{5}$/.test(result.Card[0].CardNum)) {
    // 호출 실패
    console.log(result.Card[0].CardNum);
  } else {
    // 호출 성공
    const cards = !result ? [] : result.Card;

    for (const card of cards) {
      // 필드정보는 레퍼런스를 참고해주세요.
      console.log(card);
    }
  }
}

export async function cancelStopCard(req) {
  const response = await client.CancelStopCardAsync({
    CERTKEY: certKey,
    CorpNum: req.body.corpNum || req.corpNum,
    CardNum: req.body.cardNum,
  });
  return response[0].CancelStopCardResult;
}

export async function deleteCard(req) {
  const response = await client.StopCardAsync({
    CERTKEY: certKey,
    CorpNum: req.body.corpNum || req.corpNum,
    CardNum: req.body.cardNum,
  });

  return response[0].StopCardResult;
}

export async function reRegCard(req) {
  const response = await client.ReRegistCardAsync({
    CERTKEY: certKey,
    CorpNum: req.body.corpNum || req.corpNum,
    CardNum: req.body.cardNum,
  });

  return response[0].ReRegistCardResult;
}

export async function regCardLog(req) {
  const cardNum = req.body.cardNum;
  let currentPage = 1;
  let cntLog = 100;
  while (cntLog == 100) {
    const reqBaro = {
      CERTKEY: certKey,
      CorpNum: req.body.corpNum || req.corpNum,
      ID: req.body.webId,
      CardNum: cardNum,
      BaseMonth: req.body.baseMonth,
      CountPerPage: 100,
      CurrentPage: currentPage++,
      OrderDirection: 1,
    };

    const response = await client.GetMonthlyCardLogEx2Async(reqBaro);

    const result = response[0].GetMonthlyCardLogEx2Result;

    if (result.CurrentPage < 0) {
      console.log(errorCase(result.CurrentPage));
      return result.CurrentPage;
    } else {
      // 호출 성공
      const card = await cardData.getCard(cardNum);
      const cardLogs = !result.CardLogList ? [] : result.CardLogList.CardLogEx2;
      cntLog = cardLogs.length;
      for (let i = 0; i < cntLog; i++) {
        // 필드정보는 레퍼런스를 참고해주세요.
        const words = `${cardLogs[i].UseStoreName} ${cardLogs[i].UseStoreName}`;
        const keyword = await keywordGen(words);
        console.log("keyword: ", keyword);
        await cardLogData.regCardLog({
          user: card.user,
          userId: card.userId,
          corpNum: card.corpNum,
          corpName: card.corpName,
          card: card._id,
          cardCompany: card.cardCompany,
          cardType: card.cardType,
          tradeKind: card.tradeKind,
          cardNum: card.cardNum,
          useKind: card.useKind,
          useDT: cardLogs[i].UseDT,
          cardApprovalType: cardLogs[i].CardApprovalType,
          cardApprovalNum: cardLogs[i].CardApprovalNum,
          cardApprovalCost: cardLogs[i].CardApprovalCost,
          amount: cardLogs[i].Amount,
          tax: cardLogs[i].Tax,
          serviceCharge: cardLogs[i].ServiceCharge,
          totalAmount: cardLogs[i].TotalAmount,
          useStoreNum: cardLogs[i].UseStoreNum,
          useStoreCorpNum: cardLogs[i].UseStoreCorpNum,
          useStoreName: cardLogs[i].UseStoreName,
          useStoreAddr: cardLogs[i].UseStoreAddr,
          useStoreBizType: cardLogs[i].UseStoreBizType,
          useStoreTel: cardLogs[i].UseStoreTel,
          useStoreTaxType: cardLogs[i].UseStoreTaxType,
          paymentPlan: cardLogs[i].PaymentPlan,
          installmentMonths: cardLogs[i].InstallmentMonths,
          currency: cardLogs[i].Currency,
          keyword,
        });
      }
    }
    return response[0].GetPeriodCardLogEx2Result;
  }
}

export async function updateCardInfo(req) {
  const response = await client.UpdateCardAsync({
    CERTKEY: certKey,
    CorpNum: req.body.corpNum || req.corpNum,
    CardNum: req.body.cardNum,
    WebId: req.body.webId,
    WebPwd: req.body.webPwd,
    Alias: "",
    Usage: "",
  });

  return response[0].UpdateCardResult;
}
