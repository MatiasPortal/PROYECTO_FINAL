import { addProductToCart, createCart, deleteAllProducts, deleteCart, deleteProduct, getCartById, getCarts, purchaseProduct, updateProductQuantity } from "../controllers/carts.controller.js"
import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import { Router } from "express";

const routerCart = Router();

//POST - Crear carrito.
routerCart.post("/carts", validateAdmin, createCart);

// GET - Listar todos los carritos.
routerCart.get("/carts", validateAdmin, getCarts);

//POST - Agregar producto al carrito.
routerCart.post("/carts/:cid/product/:pid", validate, addProductToCart);  

//DELETE - Borrar carrito.
routerCart.delete("/cartdelete/:cid", validateAdmin, deleteCart);

//DELETE - Borrar producto del carrito.
routerCart.delete("/carts/:cid/product/:pid", validate, deleteProduct);

//PUT - actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
routerCart.put("/carts/:cid/product/:pid", validate, updateProductQuantity);

//DELETE - Borrar todos los productos del carrito.
routerCart.delete("/carts/:cid", validate, deleteAllProducts);

//GET - Obtener un carrito por id.
routerCart.get("/carts/:cid", validate, getCartById);

//GET - Finalizar proceso de compra.
routerCart.get("/carts/:cid/purchase", validate, purchaseProduct )

export default routerCart;


        