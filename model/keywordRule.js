import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const RuleSchema = new Mongoose.Schema(
  {
    code: { type: String, required: false },
    category: { type: String, required: false },
    kind: { type: String, required: false },
    categoryName: { type: String, required: false },
    keyword: { type: [String], required: false },
    useKind: { type: String, required: false },
  },
  { timestamps: true }
);

useVirtualId(RuleSchema);
const CategoryRuleModel = Mongoose.model(`categoryRule`, RuleSchema);

export default CategoryRuleModel;
