import express from "express";
import * as controller from "../controller/empController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/reg", isAuth, controller.regEmployeeInfo);

export default router;
