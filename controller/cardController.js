import * as service from "../service/cardService.js";
import errorCase from "../middleware/baroError.js";
import * as cardData from "../data/cardData.js";
import * as userData from "../data/userData.js";
import * as logData from "../data/cardLogData.js";

export async function regCardLog(req, res) {
  try {
    const data = await service.regCardLog(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function regCard(req, res) {
  try {
    const user = req.body.user || req._id;
    let code = await service.regCard(req);
    console.log(errorCase(code));
    if (code < 0) code = await service.cancelStopCard(req);
    code = code === -51004 ? 1 : code; // 해지상태가 아닌 경우
    await service.updateCardInfo(req);

    if (code > 0) {
      const regCardResult = await cardData.regCard(user, req.body);
      res.status(200).json({ data: regCardResult, error: {} });
    } else {
      const userInfo = await userData.findById(user);
      const hasCard = userInfo.cards.find(
        (card) => card.cardNum === req.body.cardNum
      );
      console.log("hasCard", hasCard);
      if (!hasCard) {
        await cardData.regCard(user, req.body);
      }
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function stopCard(req, res) {
  try {
    const code = await service.stopCard(req, res);

    if (code > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function getCardList(req, res) {
  try {
    const data = await service.getCardList(req, res);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getCardLogs(req, res) {
  try {
    const data = await logData.getCardLogs(req);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteCard(req, res) {
  try {
    const code = await service.deleteCard(req);
    console.log({ code });
    if (code > 0) {
      const result = await cardData.deleteCard(req._id, req.body.cardNum);
      res.status(200).json({ data: result, error: {} });
    } else {
      const result = await cardData.deleteCard(req._id, req.body.cardNum);
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
