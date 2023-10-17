import express from "express";
import * as controller from "../controller/tradeCorpController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/list", isAuth, controller.getTradeCorpList);

export default router;
