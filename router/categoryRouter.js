import express from "express";
import * as controller from "../controller/categoryController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/keyword-rule", isAuth, controller.getKeywordCategoryRule);

router.put("/keyword-rule/:code", isAuth, controller.updateKeywordCategoryRule);

router.get("/keyword", isAuth, controller.keywordCategory);

router.get("/non-category/:userId", isAuth, controller.getNonCategory);

export default router;
