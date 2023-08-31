import nodeschedule from "node-schedule";
import { batchService } from "../service/batchService.js";

export async function syncBaroData() {
  nodeschedule.scheduleJob("0 0 0 * * *", async function () {
    await batchService.syncBaroAccount();
  });
}
