import express from "express";
import * as controller from "../controller/transController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.put("/merge", isAuth, controller.mergeTrans);

router.get("/log", isAuth, controller.mergeTransLogs);

router.put("/update/:id", isAuth, controller.updateTrans);

export default router;
