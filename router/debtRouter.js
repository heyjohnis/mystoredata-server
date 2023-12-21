import express from "express";
import * as controller from "../controller/debtController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/reg", isAuth, controller.regDebtInfo);

router.post("/list", isAuth, controller.getDebtList);

router.post("/auto-delete", isAuth, controller.deleteAssetNotUse);

export default router;
