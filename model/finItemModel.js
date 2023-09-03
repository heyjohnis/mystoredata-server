import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const FinItemSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    account: { type: Object, required: false, ref: `account` },
    card: { type: Object, required: false, ref: `card` },
    itemKind: { type: String, required: true },
    itemKindName: { type: String, required: true },
    finCorp: { type: String, required: true },
    itemName: { type: String, required: true },
    useYn: { type: String, required: true, default: true },
  },
  { timestamps: true }
);

useVirtualId(FinItemSchema);
const FinItemtModel = Mongoose.model(`asset`, FinItemSchema);

export default FinItemtModel;
