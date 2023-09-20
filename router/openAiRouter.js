import express from "express";
import * as controller from "../controller/openAiController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/check-human-name", isAuth, controller.checkHumanName);

export default router;
