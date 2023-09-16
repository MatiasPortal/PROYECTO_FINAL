import { addProducts, deleteProduct, getById, getProducts, mockingProducts, updatedProduct } from "../controllers/products.controller.js";
import { validate, validateAdmin, validatePremium } from "../middlewares/validate.middleware.js";

import { Router } from "express";
import upload from "../middlewares/multer.js";

const routerProducts = Router();


//GET - Obtener productos.
routerProducts.get("/products", validateAdmin, getProducts);

//GET - Obtener producto por ID.
routerProducts.get("/products/:pid", validateAdmin, getById);

//POST - Agregar producto.
routerProducts.post("/products", upload.single("thumbnail"), validate, addProducts);

//PUT - Update de producto.
routerProducts.put("/products/:pid", validateAdmin, updatedProduct);

//DELETE - Eliminar producto.
routerProducts.delete("/products/:pid", deleteProduct);


export default routerProducts;

