import config from '../../configs/config.js';
import mongoose from 'mongoose';
import productModel from "../models/products.model.js";

class ProductsDB {
    static productId = 0;

    constructor() {
        this.products = [];
    }

    //devolver los productos con paginate.
    getProducts = async(limit, page, sort, category, status) => {    
        let data = {
            limit: limit || 10,
            page: page || 1,
            sort: sort==="asc" ? { price: 1 } : "" || sort==="desc" ? { price: -1 } : "",
            lean: true
        }

        let query = {}

        if(category) {
            query.category = category;
        }

        if(status) {
            query.status = status;
        }

        try {
            let products = await productModel.paginate(query, data);
            let prevLink = `${config.APP_BASE}:${config.PUERTO}/?page=${products.prevPage}&limit=${products.limit}&sort=${sort}` || null
            let nextLink = `${config.APP_BASE}:${config.PUERTO}/?page=${products.nextPage}&limit=${products.limit}&sort=${sort}` || null

            const productFind = () => {
                if(Boolean(products.docs)) {
                    return "success";
                } else {
                    return "error";
                }
            }
    
            return {
                status: productFind(),
                payload: products.docs,
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            }
        } catch (err) {
            throw err;
        }
    }

    //agregar los productos.
    addProduct = async (product) => {
        try {
            const newProduct = await productModel.create(product);
            return newProduct;
        } catch (error) {
            throw error;
        }
    };

    //buscar producto con id específico.
    getProductById = async (id) => {
        try {
            return await productModel.findById({ '_id': new mongoose.Types.ObjectId(id) }).lean();
        }  catch(err) {
            throw err;
        }      
    };

    // update de producto por id.
    updateProduct = async(id, data) => {
        try {
            return await productModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(id) }, data)
        } catch(err) {
            throw err;
        }
    }

    // delete de producto por id.
    deleteProduct = async(id) => {
        try {
            const data = await productModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id) });
            return data;
        } catch(err) {
            throw err;
        }
    }
}


export default ProductsDB;