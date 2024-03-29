import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";
import { AccountSchema } from "./accountModel.js";
import { CardSchema } from "./cardModel.js";

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    corpNum: { type: String, required: false },
    corpName: { type: String },
    corpType: { type: String, required: true },
    userType: { type: String, required: true },
    ceoName: { type: String, required: false },
    bizType: { type: String, required: false },
    bizClass: { type: String, required: false },
    addr1: { type: String, required: false },
    addr2: { type: String, required: false },
    mobile: { type: String, required: false },
    corpId: { type: types.ObjectId },
    accounts: [AccountSchema],
    cards: [CardSchema],
    category: { type: Array, required: false },
    hometaxID: { type: String, required: false },
    hometaxPWD: { type: String, required: false },
    hometaxLoginMethod: { type: String, required: false },
    personalCategory: { type: Array, required: false },
    corpCategory: { type: Array, required: false },
    userCategory: { type: Array, required: false },
    birth: { type: String, required: false },
  },
  { timestamps: true }
);

useVirtualId(schema);
const UserModel = Mongoose.model("user", schema);
export default UserModel;
