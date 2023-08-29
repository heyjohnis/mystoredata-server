import express from "express";
import * as controller from "../controller/ruleController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/category", isAuth, controller.getCategoryRule);

router.get("/keyword", isAuth, controller.getCategoryRule);

export default router;
