import express from "express";
import * as controller from "../controller/transController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.put("/merge", isAuth, controller.mergeTrans);

router.post("/log", isAuth, controller.mergeTransLogs);

router.post("/trade-log", isAuth, controller.getTradeLogs);

router.post("/debt-log", isAuth, controller.getDebtLogs);

router.post("/emp-log", isAuth, controller.getEmployeeLogs);

router.put("/update/:id", isAuth, controller.updateTrans);

router.put("/update-category", isAuth, controller.updateCategory);

export default router;
