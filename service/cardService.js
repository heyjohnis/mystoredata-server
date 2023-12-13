import mecab from "mecab-ya";
import * as cardData from "../data/cardData.js";
import * as cardLogData from "../data/cardLogData.js";
import errorCase from "../middleware/baroError.js";
import { keywordGen } from "../utils/keywordGen.js";
import { BaroService } from "../utils/baroService.js";

const baroServiceName = "CARD";

const testService = new BaroService("CARD", "TEST");
const opsService = new BaroService("CARD", "OPS");
let isOps = true;
const certKey = isOps ? opsService.certKey : testService.certKey;
const client = isOps ? await opsService.client() : await testService.client();

export async function regCard(req) {
  const { cardCompany, cardType, cardNum, webId, webPwd, opsKind } = req.body;
  const corpNum = req.body.corpNum || req.corpNum;
  const baroSvc = new BaroService(baroServiceName, opsKind || "TEST");
  const client = await baroSvc.client();
  const response = await client.RegistCardAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum,
    CardCompany: cardCompany,
    CardType: cardType,
    CardNum: cardNum,
    WebId: webId,
    WebPwd: webPwd,
    Alias: "",
    Usage: "",
  });
  const code = response[0].RegistCardResult;
  console.log("RegistCardAsync: ", errorCase(code));
  return code;
}

export async function regBaraCard(req) {
  const body = req.body;
  body.opsKind = "TEST";
  // Baro Test 계좌확인
  const cardList = await getBaroCardList({ body });
  console.log("cardList: ", cardList);
  const hasCard = cardList.find((card) => card.CardNum === req.body.cardNum);
  if (hasCard) return "TEST";
  // Baro Test 서비스에 2개 이상시 OPS 서비스에 등록
  if (cardList.length > 1) {
    body.opsKind = "OPS";
    const code = await baroReRegCard({ body });
    console.log("baroReRegCard: ", errorCase(code));
    return code;
  }
  // Baro Test 서비스에 1개 이하시 Baro Test 서비스에 등록
  const code = await baroReRegCard(req);
  if (typeof code === "number") {
    body.opsKind = "OPS";
    const code = await baroReRegCard({ body });
  }
  return code;
}

export async function baroReRegCard(req) {
  const opsKind = req.body.opsKind;
  let code = await regCard(req);
  console.log("regCard: ", errorCase(code));
  if (code > 0) return opsKind; // 등록 성공

  code = await cancelStopCard(req);
  console.log("cancelStopCard: ", errorCase(code));
  if (code > 0) return opsKind; // 해지 취소 성공

  code = await reRegCard(req);
  console.log("reRegCard: ", errorCase(code));
  if (code > 0) return opsKind; // 재등록 성공
  return code;
}

export async function hasBaroCard(req) {
  const cardList = await getBaroCardList(req);
  const card = cardList.find((card) => card.CardNum === req.body.cardNum);
  return card;
}

export async function stopCard(req, res) {
  const { cardNum, corpNum, opsKind } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.StopCardAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum,
    CardNum: cardNum,
  });
  const code = response[0].StopCardResult;
  console.log("StopCardAsync: ", errorCase(code));
  return code;
}

export async function getBaroCardList(req) {
  const { corpNum, opsKind } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();
  const response = await client.GetCardExAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum,
    AvailOnly: 1,
  });

  const result = response[0].GetCardExResult;
  if (result && /^-[0-9]{5}$/.test(result.Card[0].CardNum)) {
    // 호출 실패
    console.log("GetCardExResult: ", errorCase(result.Card[0].CardNum));
  } else {
    // 호출 성공
    const cards = !result ? [] : result.Card;
    console.log("GetCardExAsync: ", cards);
    return cards;
  }
}

export async function cancelStopCard(req) {
  const { opsKind, corpNum, cardNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();
  const response = await client.CancelStopCardAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    CardNum: cardNum,
  });
  return response[0].CancelStopCardResult;
}

export async function reRegCard(req) {
  const { opsKind, corpNum, cardNum } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();

  const response = await client.ReRegistCardAsync({
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    CardNum: cardNum,
  });
  return response[0].ReRegistCardResult;
}

export async function regCardLog(req) {
  const hasCard = await hasBaroCard(req);
  if (!hasCard) {
    let code = await cancelStopCard(req);
    console.log("cancelStopCard: ", errorCase(code));
    if (code === -50101) code = await reRegCard(req);
    console.log("reRegCard: ", errorCase(code));
    if (code === -26006) {
      req.body.opsKind = "OPS";
      const result = await cardData.updateCard(req);
      console.log("updateCard: ", result?.n);
      code = await baroReRegCard(req);
      console.log("운영 baroReRegCard: ", errorCase(code));
    }
  }

  const { cardNum, baseMonth, corpNum, opsKind } = req.body;
  const baroSvc = new BaroService(baroServiceName, opsKind);
  const client = await baroSvc.client();
  const reqBaro = {
    CERTKEY: baroSvc.certKey,
    CorpNum: corpNum || req.corpNum,
    ID: req.body.webId,
    CardNum: req.body.cardNum,
    BaseMonth: baseMonth,
    CountPerPage: 100,
    OrderDirection: 1,
  };
  let currentPage = 1;
  let is100p = true;
  let cntLog = 0;
  while (is100p) {
    reqBaro.CurrentPage = currentPage++;
    const response = await client.GetMonthlyCardLogEx2Async(reqBaro);
    const result = response[0].GetMonthlyCardLogEx2Result;
    if (result.CurrentPage < 0) {
      console.log(errorCase(result.CurrentPage));
      return result.CurrentPage;
    } else {
      // 호출 성공
      const card = await cardData.getCard(cardNum);
      const cardLogs = !result.CardLogList ? [] : result.CardLogList.CardLogEx2;
      is100p = cardLogs === 100;
      for (let i = 0; i < cardLogs.length; i++) {
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
        cntLog++;
      }
    }
  }
  return cntLog;
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
