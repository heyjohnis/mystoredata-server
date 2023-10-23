import express from "express";
import { isAuth } from "../middleware/auth.js";
import * as controller from "../controller/finStatusController.js";

const router = express.Router();

router.post("/amount", isAuth, controller.getFinStatusAmountData);

router.post("/tax", isAuth, controller.getFinStatusTaxData);

router.post("/account", isAuth, controller.getFinStatusAccountData);

router.post("/asset", isAuth, controller.getFinStatusAssetData);

router.post("/debt", isAuth, controller.getFinStatusDebtData);

export default router;
