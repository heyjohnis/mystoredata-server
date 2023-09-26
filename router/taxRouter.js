import express from "express";
import * as controller from "../controller/taxController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/reg", isAuth, controller.regTaxScrap);

router.post("/reg-log", isAuth, controller.regTaxLog);

router.post("/logs", isAuth, controller.getTaxLogs);

router.post("/isTax", isAuth, controller.isTaxReciptLog);

export default router;
