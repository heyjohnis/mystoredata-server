import nodeschedule from "node-schedule";
import * as batchService from "../service/batchService.js";
import * as userData from "../data/userData.js";
import * as transController from "../controller/transController.js";
import { nowDate, fromAtDate, toAtDate } from "../utils/date.js";

export async function syncBaroData() {
  nodeschedule.scheduleJob("0 0 7 * * *", async function () {
    await syncBaroAccount({});
    console.log(`${nowDate()} syncBaroAccount`);
    await syncBaroCard({});
    console.log(`${nowDate()} syncBaroCard`);
    await syncTransaction({});
    console.log(`${nowDate()} syncTransaction`);
  });
}

export async function syncBaroAccount(req) {
  await batchService.syncBaroAccount(req);
}

export async function syncBaroCard(req) {
  await batchService.syncBaroCard(req);
}

export async function syncTransaction(req) {
  const users = await userData.getUserList(req);
  for (let user of users) {
    console.log("merge trans userId: ", user.userId);
    const baseMonth = new Date().toISOString().slice(0, 7);
    const baseDate = new Date().toISOString().slice(0, 10);
    await transController.mergeAccountAndCard({
      body: {
        corpNum: user.corpNum,
        userId: user.userId,
        fromAt: `${baseMonth}-01`,
        toAt: baseDate,
      },
    });
  }
}
