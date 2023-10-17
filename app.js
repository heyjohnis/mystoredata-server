import express from "express";
import "express-async-errors";
import cors from "cors";
import fs from "fs";
import http from "http";
import https from "https";
import moment from "moment-timezone";

import morgan from "morgan";
import helmet from "helmet";
import authRouter from "./router/authRouter.js";
import blogRouter from "./router/blogRouter.js";
import userRouter from "./router/userRouter.js";
import cardRouter from "./router/cardRouter.js";
import accountRouter from "./router/accountRouter.js";
import corpRouter from "./router/corpRouter.js";
import transRouter from "./router/transRouter.js";
import ruleRouter from "./router/ruleRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import finItemRouter from "./router/finItemRouter.js";
import batchTestRouter from "./router/batchTestRouter.js";
import taxRouter from "./router/taxRouter.js";
import openAiRouter from "./router/openAiRouter.js";
import finStatusRouter from "./router/finStatusRouter.js";
import tradeCorpRouter from "./router/tradeCorpRouter.js";
import empRouter from "./router/empRouter.js";
import debtRouter from "./router/debtRouter.js";
import { syncBaroData } from "./controller/batchController.js";

import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { connectDB } from "./database/database.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

morgan.token("date", (req, res, tz) => {
  return moment().tz(tz).format("YYYY-MM-DD HH:mm:ss Z");
});
app.use(
  morgan(
    `:remote-addr  :remote-user [:date[Asia/Seoul]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
  )
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/card", cardRouter);
app.use("/account", accountRouter);
app.use("/corp", corpRouter);
app.use("/trans", transRouter);
app.use("/rule", ruleRouter);
app.use("/category", categoryRouter);
app.use("/fin-item", finItemRouter);
app.use("/fin-status", finStatusRouter);
app.use("/batch", batchTestRouter);
app.use("/tax", taxRouter);
app.use("/openai", openAiRouter);
app.use("/trade-corp", tradeCorpRouter);
app.use("/emp", empRouter);
app.use("/debt", debtRouter);

syncBaroData();

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

connectDB()
  .then(() => {
    let server;
    try {
      const options = {
        ca: fs.readFileSync(config.ssl.path + config.ssl.ca),
        key: fs.readFileSync(config.ssl.path + config.ssl.key),
        cert: fs.readFileSync(config.ssl.path + config.ssl.cert),
        minVersion: "TLSv1.3",
      };

      const envHttp = config.protocol === "http" ? http : https;

      server = envHttp
        .createServer(options, app, (req, res) => {
          console.log(
            `[${config.protocol}] ${config.nodeEnv} - Connceting ...........`
          );
        })
        .listen(config.port, () => {
          console.log(
            `[${config.protocol}] ${config.nodeEnv} - Server is started`
          );
        });
    } catch (error) {
      console.log(
        `[${config.protocol}] ${config.nodeEnv} - Server is not Active. Please Check Your Server`
      );
      console.log(error);
    }
    initSocket(server);
  })
  .catch(console.error);
