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
  const body = req.body;
  try {
    const opsKind = await service.regBaraCard(req);
    // 오류코드가 존재하면 오류코드를 반환
    console.log("opsKind: ", opsKind, typeof opsKind);
    if (typeof opsKind === "number") {
      body.opsKind = "OPS";
    } else {
      body.opsKind = opsKind;
    }
    const result = await cardData.regCard({ body });
    res.status(200).json(result);
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function updateCard(req, res) {
  try {
    const result = await cardData.updateCard(req);
    res.status(200).json(result);
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
    const data = await service.getBaroCardList(req, res);
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
    const code = await service.stopCard(req);
    await cardData.deleteCard(req);
    if (code > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json(errorCase(code));
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function cancelStopCard(req, res) {
  try {
    const code = await service.cancelStopCard(req);
    console.log("code: ", errorCase(code));
    if (code > 0) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}

export async function reRegCard(req, res) {
  try {
    const code = await service.reRegCard(req);
    console.log("code: ", errorCase(code));
    if (code > 0) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
}
