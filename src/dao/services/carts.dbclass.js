import CustomError from "./customErrors.js";
import ProductsDB from "./products.dbclass.js";
import TicketClassDB from "./tickets.dbclass.js";
import cartModel from "../models/carts.model.js";
import errorsDict from "../../configs/dictionary.errors.js";
import mongoose from 'mongoose';
import transporter from "../../configs/gmail.js";

class CartsClassDB {
    constructor() {
    }

    // Obtener los carritos con populate.
    getCarts = async() => {
        try {
            const data = await cartModel.find().lean().populate('products.product');

            if(!data) {
                throw new CustomError(errorsDict.DATABASE_ERROR);
            }

            return data;
        } catch(err) {
            return  err;
        }
    }

    // Obtener carrito por id con populate.
    getCartById = async(cartId) => {
        try {
            const data = await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');

            if(!data) {
                throw new CustomError(errorsDict.VALIDATION_ERROR);
            }

            return data;
        }catch(err) {
            console.log(err)
        }
    }

    // Generar un nuevo carrito.
    addCart = async() => {
        try {
            const newCart = new cartModel();
            await newCart.save();
            return newCart;
        } catch(err) {
            return  err;
        }
    }

    // Eliminar carrito.
    deleteCart = async(cartId) => {
        try {
            const newData = await cartModel.deleteOne({ _id: cartId });

            if(!newData) {
                throw new CustomError(errorsDict.VALIDATION_ERROR);
            }

            return newData;
        } catch(err) {
            return err;
        }
    }

    // Agregar producto al carrito.
    addProductToCart = async(cartId, productId) => {
        try {
            let cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartId) });

            if(!cart) {
                throw new CustomError(errorsDict.VALIDATION_ERROR);
            }

            let productsInCart = cart.products;
            let index = productsInCart.findIndex((p) => p.product._id == productId );
            let obj = productsInCart[index]

            if(index >= 0) {
                obj.quantity++
                productsInCart[index] = obj
                let result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { products: productsInCart });
                return result;

            } else {
                let newObj = {
                    product: productId,
                    quantity: 1
                };
                
                let result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, {$push:{"products":newObj}});
                return result;
            }
        } catch(err) {
            return err;
        }
    }

    // Eliminar producto del carrito.
    deleteProductInCart = async (cartId, productId) => {
        try {   
            let cart = await cartModel.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });

            if(!cart) {
                throw new CustomError(errorsDict.VALIDATION_ERROR);
            }

            return cart;
        } catch(err) {
            return err;
        }
    };

    // Update de cantidad del carrito.
    updateProductQuantity = async (cartId, ProductId, quantity) => {
        try {
            await cartModel.updateOne({ _id: cartId,  "products._id": ProductId }, { $set: { "products.$.quantity": quantity } });
        } catch(err) {
            return err;
        }
    };

    // Update de productos en carrito.
    updateCartProducts = async (cid, products) => {
        try {
            const cart = await cartModel.findById(cid);

            if(!cart) {
                throw new CustomError(errorsDict.VALIDATION_ERROR);
            }

            const rejectedProductsIds = products.map(product => product._id);
            const updatedProducts = cart.products.filter(product => !rejectedProductsIds.includes(product.product.toString()));
            cart.products = updatedProducts;
            await cart.save();
            return cart;
        } catch(err) {
            return err;
        }
    }

    // Eliminar todos los productos del carrito.
    deleteAllProducts = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId);

            if(!cart) {
                throw new CustomError(errorsDict.VALIDATION_ERROR);
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch(err) {
            return err;
        }
    };

    // Crear ticket del carrito.
    purchaseCart = async (cid, userEmail) => {
        try {
            const dataCart = await this.getCartById(cid);
    
            if (!dataCart) {
                throw new CustomError(errorsDict.NOT_FOUND_ERROR);
            }
    
            //generar array de productos y de productos rechazados.
            let purchableProducts = [];
            let noPurchableProducts  = [];
            //precio total.
            let totalPrice = 0;
    
            const productDB = new ProductsDB();

            //obtener productos y actualizar stock.
            for (const cartProduct of dataCart.products) {
                const { product, quantity } = cartProduct;
    
                //obtener producto.
                const productData = await productDB.getProductById(product._id);
    
                //Si hay stock del producto, agregar lo solicitado a purchableProducts.
                if(productData.stock >= 0) {
                    const quantityToPurchase = Math.min(productData.stock, quantity);
                    
                    purchableProducts.push({
                        _id: product._id,
                        name: product.title,
                        price: product.price,
                        quantity: quantityToPurchase
                    });
    
                    //obtener precio total.
                    totalPrice += productData.price * quantityToPurchase;
    
                    //actualizar stock.
                    await productDB.updateProduct(product._id, { stock: productData.stock - quantityToPurchase });
        
                } 

                if (productData.stock < quantity) {
                    noPurchableProducts.push({
                        _id: product._id,
                        name: product.title,
                        price: product.price,
                        quantity: quantity - productData.stock
                    });
                }
            }
    
            //generar ticket.
            const newTicket = {
                //codigo aleatorio.
                code: Math.floor(Math.random() * (999999 - 100000) + 100000),
                amount: totalPrice,
                purchaser: userEmail,
                products: purchableProducts
            };
   
            const ticket = new TicketClassDB();
            const createTicket = await ticket.createTicket(newTicket);

    
            //GENERAR MAIL DE COMPRA.
            if(createTicket) {
                try {
                    // enviar correo.
                    const mail = await transporter.sendMail({
                        from: 'Ecommerce <portalmatias4@gmail.com>',
                        to: userEmail,
                        subject: 'Compra realizada',
                        html: `<h1>PEDIDO REALIZADO CON ÉXITO</h1>
                                <h2>Productos comprados:</h2>
                                <ul>${newTicket.products.map(p => `<li>Nombre: ${p.name} - Cantidad: ${p.quantity} - Precio: ${p.price}</li>`).join('')}</ul>
                                <h2><strong>Codigo de compra: </strong>${newTicket.code}</h2>
                                <h2><strong>Monto total: </strong>${newTicket.amount}</h2>`
                    });
                    console.log(mail);
    
                } catch(err) {
                    console.log(err);
                }

                //eliminar productos del carrito una vez finalizada la compra
                this.deleteAllProducts(cid)
    
                //devolver ticket y productos rechazados.
                return { ticket: newTicket, rejectedProducts: noPurchableProducts };
                     
            } else {
                throw new CustomError(errorsDict.INTERNAL_ERROR);
            }
        } catch(err) {
            throw new CustomError(errorsDict.INTERNAL_ERROR);
        }
    }
}

export default CartsClassDB;