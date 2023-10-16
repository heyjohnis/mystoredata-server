import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const EmployeeSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    corpName: { type: String, required: true },
    corpNum: { type: String, required: true },
    empName: { type: String, required: false },
    recentPay: { type: Number, required: false },
    useYn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

useVirtualId(TaxLogSchema);
const TaxLogModel = Mongoose.model(`employee`, EmployeeSchema);

export default TaxLogModel;
