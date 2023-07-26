import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const userSchema = new Mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { 
      first: { type: String, required: true },
      last: { type: String, required: true },
     },
     age: Number,
     email: String,
  }, { timestamps: true }
);

useVirtualId(userSchema);
const user = Mongoose.model('user', userSchema);

export default user;