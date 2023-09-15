import CartsClassDB from "../dao/services/carts.dbclass.js";
import CustomError from "../dao/services/customErrors.js";
import ProductsClassDB from "../dao/services/products.dbclass.js";
import TicketClassDB from "../dao/services/tickets.dbclass.js";
import errorsDict from "../configs/dictionary.errors.js";

const cart = new CartsClassDB();
const product = new ProductsClassDB();


// Crear carrito.
export const createCart = async(req, res, next) => {
    try {
        const data = await cart.addCart();

        if(!data) {
            throw new CustomError(errorsDict.DATABASE_ERROR);
        }

        res.status(200).send({ status:  "ok",  message: `Carrito creado`, data  });
        
    } catch(err) {
        next(err);
    }
};

// Obtener carritos.
export const getCarts = async(req, res, next) => {
    try {
        const carts = await cart.getCarts()

        if(!carts) {
            throw new CustomError(errorsDict.DATABASE_ERROR);
        }

        res.status(200).send({ status: "ok", carts })
    } catch(err) {
        next(err);
    }
};

// Agregar producto al carrito.
export const addProductToCart = async(req, res, next) => {
    const { cid, pid } = req.params;
    const productToAdd = await product.getProductById(pid);
    const productOwner = productToAdd.owner
    const userId = req.user._id.toString();

    // si el owner(premium) del producto quiere comprar su producto no va a poder.
    if(productOwner === userId || req.user.role === "admin") {
        return res.status(400).send(errorsDict.VALIDATION_ERROR);
    }
        
    try {
        const data = await cart.addProductToCart(cid, pid);
        
        if(!data) {
            return res.status(404).send(errorsDict.NOT_FOUND_ERROR);
        }

        res.status(200).send({ status: "ok", message: "Producto agregado al carrito", data });
    }catch(err) {
        next(err)
    }
};

// Borrar carrito.
export const deleteCart = async(req, res, next) => {
    const { cid } = req.params;

    try {
        const data = await cart.deleteCart(cid);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "ok", message: "Carrito eliminado", data });

    } catch(err) {
        next(err)
    }
};

// Borrar producto del carrito.
export const deleteProduct = async(req, res, next) => {
    const { cid, pid } = req.params;

    try {
        const data = await cart.deleteProductInCart(cid, pid);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "ok", message: "Producto eliminado del carrito", data });

    } catch(err) {
        next(err)
    }
};

// Update cantidad.
export const updateProductQuantity = async(req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const data = await cart.updateProductQuantity(cid, pid, quantity);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "ok", message: "Producto actualizado", data });

    } catch(err) {
        next(err)
    }
};

// Borrar todos los productos del carrito.
export const deleteAllProducts = async(req, res, next) => {
    const { cid } = req.params;

    try{
        const data = await cart.deleteAllProducts(cid);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "ok", message: "Productos del carrito eliminado" });   

    } catch(err) {
        next(err)
    }
};

// Obtener carrito por id.
export const getCartById = async(req, res, next) => {
    const { cid } = req.params;

    try {
        const data = await cart.getCartById(cid);

        if(!data) {
            throw new CustomError(errorsDict.NOT_FOUND_ERROR);
        }

        res.status(200).send({ message: "Carrito encontrado.", data:  data });
    } catch(err) {
        next(err)
    }
};

// Generar ticket de compra.
export const purchaseProduct = async(req, res, next) => {
    const { cid } = req.params;
    const userEmail = req.session.user.email;

    try {
        const data = await cart.purchaseCart(cid, userEmail);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "ok", message: "Compra realizada", data: data });
    } catch(err) {
        next(err)
    }
};

