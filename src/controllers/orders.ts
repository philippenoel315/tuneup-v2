import path from 'path';
import { fileURLToPath } from 'url';
import { EmailOptions } from '../types/types.js';
import ejs from 'ejs';
import e, { Request, Response } from 'express';
import { sendEmail } from '../mailer.js';
import Order from '../models/order.js';
import { OrderAttributes } from '../types/types.js';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const newOrder = await Order.create(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [updated] = await Order.update(req.body, {
            where: { id: Number(id) }
        });
        if (updated) {
            const updatedOrder = await Order.findOne({ where: { id: Number(id) } });
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await Order.destroy({
            where: { id: Number(id) }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
