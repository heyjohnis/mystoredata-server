import express from "express";
import * as controller from "../controller/corpController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/check", isAuth, controller.checkCorpIsMember);

router.post("/reg", isAuth, controller.registCorp);

export default router;
