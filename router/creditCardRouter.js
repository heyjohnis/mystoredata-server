import express from "express";
import * as controller from "../controller/creditCardController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/reg", isAuth, controller.regCreditCardInfo);

router.post("/list", isAuth, controller.getCreditCardList);

router.post("/debt", isAuth, controller.getCashedPayableLogs);

export default router;
