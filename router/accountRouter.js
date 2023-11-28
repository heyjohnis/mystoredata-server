import express from "express";
import * as controller from "../controller/accountController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/list", isAuth, controller.getAccounts);

router.post("/reg", isAuth, controller.regAccount);

router.put("/update", isAuth, controller.updateAccount);

router.post("/regLog", isAuth, controller.regAcountLog);

router.get("/log", isAuth, controller.getAccountLogs);

router.post("/log", isAuth, controller.getAccountLogs);

router.delete("/delete/:_id", isAuth, controller.deleteAccount);

/* BaroBill */
router.post("/baro-reg", isAuth, controller.baroRegAccount);

router.post("/cancel", isAuth, controller.stopAccount);

router.post("/cancel-stop", isAuth, controller.cancelStopAccount);

router.post("/re-reg", isAuth, controller.reRegAccount);

export default router;
