import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "carts";
/* const collection = "carts-test"; */

const schemaOptions = {
    versionKey: false
};

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number,
                _id: false,
            },
        ],
        default: [],
    }
}, schemaOptions);

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;