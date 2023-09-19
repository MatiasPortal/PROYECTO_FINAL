import CustomError from "../dao/services/customErrors.js";
import ProductsDB from "../dao/services/products.dbclass.js";
import errorsDict from "../configs/dictionary.errors.js";
import { generateProduct } from "../configs/faker.js";
import transporter from "../configs/gmail.js";

const product = new ProductsDB();

// Obtener productos.
export const getProducts = async (req, res, next) => {
    const {limit, page, sort, category, status} = req.query;

    try {
        let products = await product.getProducts(limit, page, sort, category, status);

        const allProducts = products.payload;

        if(!products) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "success", allProducts });
    
    } catch(err) {
        next(err);
    }   
};

// Agregar producto.
export const addProducts = async (req, res, next) => {
    try {
         const { title, description, code, price, stock, category, owner } = req.body;
         const productToAdd = { title, description, code, price, stock, category, owner }

         if(!title || !description || !code || !price || !stock || !category) {
             throw new CustomError(errorsDict.VALIDATION_ERROR);
         }

         if(req.file) {
            //asignar el nombre del archivo
            productToAdd.thumbnail = req.file.filename;
         }

         if(req.user.email !== "adminCoder@coder.com") {
            productToAdd.owner = req.user._id; 
         } else {
            productToAdd.owner = "admin";
         }

         
        const data = await product.addProduct(productToAdd);


        if(data.status === "error") {
            return res.status(404).send({ data });
        }
        res.status(200).send({ status: "success", productToAdd })
    } catch(err){
        next(err)
    }
};

// Obtener producto por id.
export const getById = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const productId = await product.getProductById(pid);


        if(!productId) {
            throw new CustomError(errorsDict.NOT_FOUND_ERROR);
        }

        res.status(200).send({ status: "success", productId });

    } catch(err) {
        next(err)
    }
};

// Update de producto.
export const updatedProduct = async (req, res, next) => {
    try{
        let data = await product.updateProduct(req.params.pid, req.body);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        return res.status(200).send({ status: "success", message: "Producto actualizado", data })
    } catch(err) {
        next(err);
    }
};

// Eliminar producto.
export const deleteProduct = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const productToDelete = await product.getProductById(pid);

        if(productToDelete) {
            if(req.user.role === "admin") {
                await product.deleteProduct(pid);
                const mail = transporter.sendMail({
                    from: 'Ecommerce <portalmatias4@gmail.com>',
                    to: req.user.email,
                    subject: 'El producto ha sido eliminado',
                    text: `¡Hola, el producto ${productToDelete.title} ha sido eliminado con éxito!`
                })
                return res.status(200).send("Producto eliminado");
            }
        }

        if(productToDelete) {
            const productOwner = JSON.parse(JSON.stringify(productToDelete.owner));
            const userId = req.user._id;

            if ((req.user.role === "premium" && productOwner === userId) || req.user.role === "admin") {
                await product.deleteProduct(pid);
                const mail = transporter.sendMail({
                    from: 'Ecommerce <portalmatias4@gmail.com>',
                    to: req.user.email,
                    subject: 'El producto ha sido eliminado',
                    text: `¡Hola, el producto ${productToDelete.title} ha sido eliminado con éxito!`
                })
                return res.status(200).send("Producto eliminado");
            } else {
                res.status(403).send("No se pudo borrar este producto, no es dueño del producto o admin.");
            }
        } else {
            return res.status(404).send(errorsDict.NOT_FOUND_ERROR);
        }

    } catch(err) {
        next(err);
    }
};

// generar producto mock.
export const mockingProducts = async (req, res) => {
    try {
        let products = [];

        for (let i = 0; i < 100; i++) {
            let product = generateProduct();
            products.push(product);
        }
        
        res.send({ status: "success", payload: products })
        
    } catch(err) {
        res.status(500).send(err);
    }   
};


