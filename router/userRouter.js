import express from "express";
import * as data from "../data/userData.js";
import * as controller from "../controller/userController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/list", isAuth, controller.getUserList);

router.put("/update", isAuth, controller.updateUser);

router.put("/reset-category", controller.resetCategory);

router.get("/category", isAuth, controller.getCategory);

router.get("/category/:user", isAuth, controller.getUserCategory);

export default router;
