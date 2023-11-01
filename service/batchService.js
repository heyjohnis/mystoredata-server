import * as accountData from "../data/accountData.js";
import * as accountService from "../service/accountService.js";
import * as cardService from "../service/cardService.js";
import * as cardData from "../data/cardData.js";

export async function syncBaroAccount(req) {
  const accounts = await accountData.getAccountList(req);
  console.log("batch accounts: ", accounts);
  for (let account of accounts) {
    const { bankAccountNum, corpNum, userId } = account;

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
      userId
    );
    await accountService.regAcountLog({
      body: {
        bankAccountNum,
        corpNum,
        userId,
        baseMonth,
      },
    });
    await accountData.updateAccountAmount({ body: { bankAccountNum } });
  }
}

export async function syncBaroCard(req) {
  const cards = await cardData.getCardList(req);
  console.log("cards: ", cards);
  for (let card of cards) {
    const { cardNum, corpNum, userId, webId, cardType, tradeKind } = card;

    let baseMonth = new Date();
    if (baseMonth.getDate() === 1) {
      baseMonth = baseMonth.setMonth(baseMonth.getMonth() - 1);
    }
    baseMonth = new Date(baseMonth).toISOString().slice(0, 7).replace("-", "");

    console.log("baseMonth: ", baseMonth, cardNum, corpNum, userId);
    await cardService.regCardLog({
      body: {
        cardNum,
        corpNum,
        userId,
        baseMonth,
        webId,
        cardType,
        tradeKind,
      },
    });
  }
}
