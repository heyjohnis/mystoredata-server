import express from "express";
import * as controller from "../controller/batchController.js";

const router = express.Router();

router.get("/sync-account", controller.syncBaroAccount);

router.get("/sync-card", controller.syncBaroCard);

router.get("/sync-merge", controller.syncTransaction);

router.get("/sync-test", controller.syncDaily);

export default router;
