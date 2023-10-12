import nodeschedule from "node-schedule";
import * as batchService from "../service/batchService.js";
import * as userData from "../data/userData.js";
import * as transController from "../controller/transController.js";
import * as taxController from "../controller/taxController.js";
import * as taxService from "../service/taxService.js";
import * as taxData from "../data/taxLogData.js";
import { nowDate } from "../utils/date.js";

export async function syncBaroData() {
  nodeschedule.scheduleJob("0 0 7 * * *", async function () {
    await syncBaroAccount({});
    console.log(`${nowDate()} syncBaroAccount`);
    await syncBaroCard({});
    console.log(`${nowDate()} syncBaroCard`);
    await syncTransaction({});
    console.log(`${nowDate()} syncTransaction`);
  });

  nodeschedule.scheduleJob("0 50 23 * * *", async function () {
    regTaxLogByBaro();
  });
  nodeschedule.scheduleJob("0 10 12 * * *", async function () {
    regTaxLogByBaro();
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

async function regTaxLogByBaro() {
  try {
    const homeTaxUsers = await userData.getHomeTaxUsers();
    const fromAt = (new Date().toISOString().slice(0, 7) + "-01").replaceAll(
      "-",
      ""
    );
    const toAt = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    for (const user of homeTaxUsers) {
      user.fromAt = fromAt;
      user.toAt = toAt;
      user.user = user._id;
      console.log("user: ", user.fromAt, user.toAt);
      const cntSales = await taxService.getPeriodTaxInvoiceSalesListAsync(user);
      const cntPurchase = await taxService.getPeriodTaxInvoicePurchaseListAsync(
        user
      );
      await taxData.notUseCanceledTaxLog(user);
      console.log(`[tax sync] - ${nowDate()} - ${cntSales + cntPurchase}`);
    }
  } catch (error) {
    console.error(error);
  }
}
