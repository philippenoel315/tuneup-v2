import express, { Router, Request, Response } from 'express';
import path from 'path';
import * as orderController from '../controllers/controller.js';

const router: Router = express.Router();

router.get('/form', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'static', 'form.html'));
});

router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'static', 'welcome.html'));
});

router.post('/submit', orderController.submitOrder);

router.get('/orders', orderController.getOrders);

router.post('/update-status', orderController.updateStatus);

export default router;