import * as accountData from "../data/accountData.js";
import * as accountService from "../service/accountService.js";
import * as cardService from "../service/cardService.js";
import * as cardData from "../data/cardData.js";
import errorCase from "../middleware/baroError.js";

export async function syncBaroAccount(req) {
  const accounts = await accountData.getAccountList(req);
  console.log("batch accounts: ", accounts);
  for (let account of accounts) {
    const { bankAccountNum, corpNum, userId, opsKind, useKind } = account;

    // 해지계좌 해제 및 재등록 처리
    req.body = { ...req.body, opsKind, corpNum, bankAccountNum };
    let code = await accountService.cancelStopAccount(req);
    console.log("cancelStopAccount: ", bankAccountNum, errorCase(code));
    code = await accountService.reRegAccount(req);
    console.log("reRegAccount: ", bankAccountNum, errorCase(code));
    // 충전잔액 문제로 해지된 경우, 운영계정으로 재등록
    if (code === -26006) {
      req.body.opsKind = "OPS";
      req.body.useKind = useKind;
      const result = await accountData.updateAccount(req);
      console.log("updateAccount: ", result?.n);
    }
    let baseMonth = new Date();
    if (baseMonth.getDate() === 1) {
      baseMonth = baseMonth.setMonth(baseMonth.getMonth() - 1);
    }
    baseMonth = new Date(baseMonth).toISOString().slice(0, 7).replace("-", "");
    console.log(
      "batch baseMonth: ",
      baseMonth,
      bankAccountNum,
      corpNum,
      userId,
      opsKind
    );
    await accountService.regAccountLog({
      body: {
        bankAccountNum,
        corpNum,
        userId,
        baseMonth,
        opsKind,
      },
    });
    await accountData.updateAccountAmount({ body: { bankAccountNum } });
  }
}

export async function syncBaroCard(req) {
  const cards = await cardData.getCardList(req);
  console.log("cards: ", cards);
  for (let card of cards) {
    const { cardNum, corpNum, userId, webId, cardType, tradeKind, opsKind } =
      card;

    // 해지카드 해제 및 재등록 처리
    req.body = { ...card._doc };
    // console.log("syncBaroCard req.body: ", req.body);
    // let code = await cardService.cancelStopCard(req);
    // console.log("cancelStopCard: ", cardNum, errorCase(code));
    // code = await cardService.reRegCard(req);
    // console.log("reRegCard: ", cardNum, errorCase(code));
    // if (code === -26006) {
    //   req.body.opsKind = "OPS";
    //   const result = await cardData.updateCard(req);
    //   console.log("updateCard: ", result?.n);
    //   code = await cardService.baroReRegCard(req);
    //   console.log("운영 baroReRegCard: ", errorCase(code));
    // }

    let baseMonth = new Date();
    // 매달 1일의 경우 전월로 설정
    if (baseMonth.getDate() === 1) {
      baseMonth = baseMonth.setMonth(baseMonth.getMonth() - 1);
    }
    baseMonth = new Date(baseMonth).toISOString().slice(0, 7).replace("-", "");

    console.log("baseMonth: ", baseMonth, cardNum, corpNum, userId, opsKind);
    await cardService.regCardLog({
      body: {
        cardNum,
        corpNum,
        userId,
        baseMonth,
        webId,
        cardType,
        tradeKind,
        opsKind,
      },
    });
  }
}
