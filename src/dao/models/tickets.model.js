import mongoose from "mongoose";

const collection = 'tickets';

const schema = new mongoose.Schema({
    code: { type: String, required: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }]
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;