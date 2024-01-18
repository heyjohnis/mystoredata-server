import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const schema = new Mongoose.Schema(
  {
    userId: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: Object, required: true },
    finClass: { type: Object, required: true },
    finClassAmount: { type: Object, required: true },
  },
  { timestamps: true }
);

useVirtualId(schema);
const AnnualModel = Mongoose.model(`annual`, schema);

export default AnnualModel;
