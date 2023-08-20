import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const { Types } = Mongoose;

const schema = new Mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true },
    user: { type: Types.ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);
useVirtualId(schema);
const blog = Mongoose.model("blog", schema);

export default blog;
