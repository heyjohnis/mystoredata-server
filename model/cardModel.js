import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const CardSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    corpName: { type: String, required: true },
    corpNum: { type: String, required: true },
    cardCompany: { type: String, required: true },
    cardType: { type: String, required: true },
    cardNum: { type: String, required: true },
    webId: { type: String, required: false },
    webPwd: { type: String, required: false },
    useKind: { type: String, required: false },
  },
  { timestamps: true }
);

useVirtualId(CardSchema);
const CardModel = Mongoose.model(`card`, CardSchema);

export default CardModel;
