import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express, { Router, Request, Response } from 'express';
import * as orderController from '../controllers/orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: Router = express.Router();

router.get('/orders', orderController.getOrders);

router.post('/orders', orderController.createOrder);

router.put('/orders/:id', orderController.updateOrder);

router.delete('/orders/:id', orderController.deleteOrder);

export default router