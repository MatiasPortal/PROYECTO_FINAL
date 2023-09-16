import mongoose from "mongoose";

const collection = "users";
/* const collection = "users-test"; */

const schema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    age: { type: Number },
    password: { type: String },
    cart: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: { type: String, trim: true, default: "user", enum: ["user", "admin", "premium"]  },
    documents: {
        type: [
            {
                name: { type: String, required: true },
                reference: { type: String, required: true }
            }
        ],
        default: []
    },
    status: { 
        type: String,
        required: true,
        enums: ["completo", "incompleto", "pendiente"],
        default: "pendiente"
    },
    last_connection: { type: Date, default: Date.now  }
});

const userModel = mongoose.model(collection, schema);

export default userModel;