import express from "express";
import * as controller from "../controller/transController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.put("/merge", isAuth, controller.mergeTrans);

router.post("/log", isAuth, controller.getTransLogs);

router.post("/trade-log", isAuth, controller.getTradeLogs);

router.post("/debt-log", isAuth, controller.getDebtLogs);

router.post("/asset-log", isAuth, controller.getAssetLogs);

router.post("/credit-log", isAuth, controller.getCreditCardLogs);

router.post("/emp-log", isAuth, controller.getEmployeeLogs);

router.put("/update/:id", isAuth, controller.updateTrans);

router.put("/update-category", isAuth, controller.updateCategory);

router.post("/class-category", isAuth, controller.getTransCategoryByClass);

router.post("/reg-credit-debt", isAuth, controller.createCreditCardDebt);

router.post("/trade-item", isAuth, controller.getTradeItem);

export default router;
