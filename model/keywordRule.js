import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const RuleSchema = new Mongoose.Schema(
  {
    code: { type: String, required: false },
    name: { type: String, required: false },
    useKind: { type: String, required: false },
    keyword: { type: [String], required: false },
    order: { type: Number, required: false },
    finClass: { type: String, required: false },
  },
  { timestamps: true }
);

useVirtualId(RuleSchema);
const KeywordRuleModel = Mongoose.model(`categoryKeyword`, RuleSchema);

export default KeywordRuleModel;
