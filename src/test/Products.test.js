//Chai supertest - route products.

import chai from 'chai';
import { generateToken } from '../configs/utils.js';
import mongoose from 'mongoose';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8000');

describe('Testing products routes', () => {
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

    let authToken;
    
    before(async function () {
        try {
            await mongoose.connect("mongodb+srv://user:user@cluster0.b5bhaje.mongodb.net/ecommerce");
            await mongoose.connection.dropCollection('products-test');

            const user = {
                firstName: "user",
                lastName: "test",
                email: "userTest@gmail.com",
                age: 1,
                role: "admin",
                _id: "64dff95e5ea2999b097a656a",
                cart: "64dff95e5ea2999b097a656c"
            }
            authToken = generateToken(user)
        } catch(err) {
            console.error(err.message);
        }
    });

        it('POST - /api/products - Debe crear un producto', async function() {
            const { statusCode, ok, body } = await requester.post('/api/products').set('Authorization', `Bearer ${authToken}`).send(productTest);

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body).to.be.an('object');
        });

        it('POST - /api/products - campo vacío retornar error', async function() {
            const data = { ...productTest, title: undefined };
            const { statusCode } = await requester.post('/api/products').send(data);

            expect(statusCode).to.eql(400);
        });

        it('GET - /api/products - Debe retornar array de productos', async function() {
            const { statusCode, ok, body } = await requester.get('/api/products');

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body.allProducts).to.be.an('array'); 
        });

        it('GET - /api/products/:pid - Retornar producto por id', async function() {
            const resp = await requester.get('/api/products');
            const { statusCode, ok, body } = await requester.get(`/api/products/${resp.body.allProducts[0]._id}`);

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body.productId).to.be.an('object');
        });

        it('PUT - /api/products/:pid - Debe actualizar producto', async function() {
            const resp = await requester.get('/api/products');
            const currentProduct = resp.body.allProducts[0];

            const updatedProduct = { ...currentProduct, price: 2000 }

            const { statusCode, ok, body } = await requester.put(`/api/products/${currentProduct._id}`).send(updatedProduct);

            expect(statusCode).to.eql(200);
            expect(ok).to.eql(true);
            expect(body.data).to.be.an('object');
        });

        // HABRIA QUE GENERAR UN USUARIO PARA PODER REALIZAR EL TEST.
            /* it('DELETE - /api/products/:pid - No debe dejar borrar producto si no sos admin o dueño del producto.', async function() {
            const resp = await requester.get('/api/products');
            console.log(resp.body.allProducts[0]._id)
            const { statusCode, ok, body } = await requester.delete(`/api/products/${resp.body.allProducts[0]._id}`);

            expect(statusCode).to.eql(403);
            expect(ok).to.eql(true); 

        })  */

    after(async function () {
        try {
            await mongoose.disconnect()
        } catch(err) {
            console.error(err.message);
        }
    })
})
