import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const types = Mongoose.Types;
export const TradeCorpSchema = new Mongoose.Schema(
  {
    user: { type: types.ObjectId, ref: `user`, required: true },
    userId: { type: String, required: true },
    corpName: { type: String, required: true },
    corpNum: { type: String, required: true },
    tradeType: { type: String, required: true },
    tradeCorpNum: { type: String, required: false },
    tradeCorpName: { type: String, required: false },
    tradeCorpCEOName: { type: String, required: false },
    tradeCorpAddr: { type: String, required: false },
    tradeCorpBizType: { type: String, required: false },
    tradeCorpBizClass: { type: String, required: false },
    tradeCorpEmail: { type: String, required: false },
    tradeRemark: { type: String, required: false },
    useYn: { type: Boolean, default: true },
  },
  { timestamps: true }
);

useVirtualId(TradeCorpSchema);
const TradeCorpModel = Mongoose.model(`tradeCorp`, TradeCorpSchema);

export default TradeCorpModel;
