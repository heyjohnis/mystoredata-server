import Mongoose from 'mongoose';
import { useVirtualId } from '../database/database.js';

const types = Mongoose.Types;
const schema = new Mongoose.Schema(
  {
    corpNum: { type: String, required: true },
    corpName: { type: String, required: true },
    ceoName: { type: String,  },
    bizType: { type: String,  },
    BizClass: { type: String,  },
		addr1: { type: String,  },
		addr2: { type: String,  },
		tel: { type: String,  },
		email: { type: String,  },
    user: { type: types.ObjectId, required: true, ref: "user" },
    isLinkedData: { type: Boolean, required: true, default: false },
  }, { timestamps: true }
);

useVirtualId(schema);
const Corp = Mongoose.model('crop', schema);

export async function createCorp(data) {
  return new Corp(data).save().then( res => res.id);
}
