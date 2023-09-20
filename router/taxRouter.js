import express from "express";
import * as controller from "../controller/taxController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/reg", isAuth, controller.regTaxScrap);

router.post("/log", isAuth, controller.getTaxList);

export default router;
