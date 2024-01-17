import express from "express";
import * as controller from "../controller/annualController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/sum", isAuth, controller.getCategorySum);

router.post("/year", isAuth, controller.getAnnualYearData);

router.post("/save", isAuth, controller.saveAnnualSum);

export default router;
