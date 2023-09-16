import chai from 'chai';
import mongoose from 'mongoose';
import productModel from '../dao/models/products.model.js';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8000');

describe('Testing carts routes', () => {
    const productTest = {
        title: 'test product',
        description: 'test description',
        price: 100,
        code: 'test code',
        status: true,
        category: 'test category',
        stock: 10,
        thumbnail: 'test thumbnail'
    };
 
    before(async function () {
        try {
            await mongoose.connect('mongodb+srv://user:user@cluster0.b5bhaje.mongodb.net/ecommerce');
            await mongoose.connection.dropCollection('carts-test');
            await mongoose.connection.dropCollection('products-test');
        } catch(err) {
            console.error(err.message);
        }
    });

        it('POST - /api/carts - Debe crear un carrito exitosamente con id y array de productos.', async function() {
            const { statusCode, ok, body } = await requester.post('/api/carts')

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body.data._id).to.be.an('string');
            expect(body.data.products).to.be.an('array');
        });

        it('GET - /api/carts - Debe listar todos los carritos', async function() {
            const { statusCode, ok, body } = await requester.get('/api/carts')

            console.log(body.carts)
            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body).to.be.an('object');
        });

        it('POST - /api/carts/:cid/product/:pid - Debe agregar producto al carrito', async function() {
            const product = await productModel.create(productTest);
            const productID = product._id;

            const getCart = await requester.get('/api/carts');
            const cartID = getCart.body.carts[0]._id;

            console.log(getCart.body)
            

            const { statusCode, ok, body } = await requester.post(`/api/carts/${cartID}/product/${productID}`)

            console.log(body)

            /* expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body.data._id).to.be.an('string');
            expect(body.data.products).to.be.an('array'); */
        });


    after(async function () {
        try {
            await mongoose.disconnect()
        } catch(err) {
            console.error(err.message);
        }
    })
})