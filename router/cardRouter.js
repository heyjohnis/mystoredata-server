import express from "express";
import * as controller from "../controller/cardController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/regLog", controller.regCardLog);

router.post("/reg", isAuth, controller.regCard);

router.put("/update", isAuth, controller.updateCard);

router.post("/stop", isAuth, controller.stopCard);

router.get("/list", isAuth, controller.getCardList);

router.get("/log", isAuth, controller.getCardLogs);

router.post("/log", isAuth, controller.getCardLogs);

router.delete("/delete/:_id", isAuth, controller.deleteCard);

router.post("/cancel-stop", isAuth, controller.cancelStopCard);

router.post("/re-reg", isAuth, controller.reRegCard);

export default router;
