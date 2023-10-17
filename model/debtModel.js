import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const DebtSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    corpNum: { type: String, required: true },
    corpName: { type: String, required: true },
    debtTypeName: { type: String, required: true },
    debtTypeCode: { type: String, required: true },
    debtName: { type: String, required: true },
    transRemark: { type: String, required: true },
    useYn: { type: Boolean, default: true },
  },
  { timestamps: true }
);
DebtSchema.index(
  { userId: 1, transRemark: 1, debtTypeCode: 1 },
  { unique: true }
);
useVirtualId(DebtSchema);
const DedtModel = Mongoose.model(`debt`, DebtSchema);

export default DedtModel;
