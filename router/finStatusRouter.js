import express from "express";
import { isAuth } from "../middleware/auth.js";
import * as controller from "../controller/finStatusController.js";

const router = express.Router();

router.post("/amount", isAuth, controller.getFinStatusAmountData);

router.post("/tax", isAuth, controller.getFinStatusTaxData);

router.post("/asset", isAuth, controller.getFinStatusAssetData);

export default router;
