import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express, { Router, Request, Response } from 'express';
import * as orderController from '../controllers/controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: Router = express.Router();

router.get('/form', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '..', '..', 'static', 'form.html'));
});

router.get('/', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '..', '..', 'static', 'welcome.html'));
});

router.get('/admin',(req:Request, res:Response)=>{
  res.sendFile(join(__dirname, '..', '..', 'static', 'authenticateHtml.html'));

});

router.post('/authenticate', orderController.authenticate);

router.post('/submit', orderController.submitOrder);

router.get('/orders', orderController.getOrders);

router.post('/update-status', orderController.updateStatus);

export default router;