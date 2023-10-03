import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const RuleSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    useStoreBizType: { type: String, required: false },
    useStoreName: { type: String, required: false },
    transRemark: { type: String, required: false },
    keyword: { type: [String], required: false },
    category: { type: String, required: false },
    categoryName: { type: String, required: false },
    useKind: { type: String, required: false },
    transMoney: { type: String, required: false },
    finClassCode: { type: String, required: false },
    finClassName: { type: String, required: false },
  },
  { timestamps: true }
);

useVirtualId(RuleSchema);
const CategoryRuleModel = Mongoose.model(`categoryRule`, RuleSchema);

export default CategoryRuleModel;
