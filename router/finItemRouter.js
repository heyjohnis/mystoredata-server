import express from "express";
import * as controller from "../controller/finItemController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/reg", isAuth, controller.regFinItem);

router.put("/update/:_id", isAuth, controller.updateFinItem);

router.get("/list", isAuth, controller.listFinItem);

export default router;
