import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const schema = new Mongoose.Schema(
  {
    userId: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: Object, required: true },
    IN1: { type: Array, required: false },
    IN2: { type: Array, required: false },
    IN3: { type: Array, required: false },
    OUT1: { type: Array, required: false },
    OUT2: { type: Array, required: false },
    OUT3: { type: Array, required: false },
  },
  { timestamps: true }
);

useVirtualId(schema);
const AnnualModel = Mongoose.model(`annual`, schema);

export default AnnualModel;
