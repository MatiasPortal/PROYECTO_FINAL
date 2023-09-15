import { Router } from 'express';
import { mockingProducts } from '../controllers/products.controller.js';

const routerMocking = Router();

// generar ruta para productos mocks.
routerMocking.get('/mockingproducts', mockingProducts);

export default routerMocking;