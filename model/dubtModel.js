import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const DubtSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    corpNum: { type: String, required: true },
    corpName: { type: String, required: true },
    dubtType: { type: String, required: true },
    dubtName: { type: String, required: true },
    transRemark: { type: String, required: false },
    useYn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

useVirtualId(DubtSchema);
const DudtModel = Mongoose.model(`employee`, DubtSchema);

export default DudtModel;
