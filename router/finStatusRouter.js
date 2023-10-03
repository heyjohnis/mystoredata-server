import express from "express";
import { isAuth } from "../middleware/auth.js";
import * as controller from "../controller/finStatusController.js";

const router = express.Router();

router.post("/amount", isAuth, controller.getFinStatusAmountData);

export default router;
