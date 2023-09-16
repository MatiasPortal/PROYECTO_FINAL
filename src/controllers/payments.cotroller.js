import Stripe from "stripe";
import cartModel from "../dao/models/carts.model.js";
import config from "../configs/config.js";
import mongoose from "mongoose";

const stripe = new Stripe(config.STRIPE_SECRET_KEY)

export const createSession = async(req, res) => {
    try {   
        const cartId = req.user.cart._id.toString();
        const cart = await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');

        const lineItems = cart.products.map(cartProduct => {
            const product = cartProduct.product;

            return {
                price_data: {
                    currency: 'ars',
                    product_data: {
                        name: product.title,
                        description: product.description
                    },
                    unit_amount: product.price * 100
                },
                quantity: cartProduct.quantity
            }
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${config.APP_BASE}/api/carts/${cartId}/purchase`,
            cancel_url: `${config.APP_BASE}/cancel`
        })

        res.status(200).json({ url: session.url })
    } catch(err) {
        console.log(err)
    }
}