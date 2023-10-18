import express from "express";
import * as controller from "../controller/assetController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/reg", isAuth, controller.regAssetInfo);

router.post("/list", isAuth, controller.getAssetList);

export default router;
