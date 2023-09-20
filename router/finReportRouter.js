import express from "express";
import * as controller from "../controller/finReportController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/category", isAuth, controller.getCategoryReportData);

export default router;
