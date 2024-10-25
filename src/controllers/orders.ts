import path from 'path';
import { fileURLToPath } from 'url';
import { EmailOptions } from '../types/types.js';
import ejs from 'ejs';
import e, { Request, Response } from 'express';
import Order from '../models/order.js';


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

    let orders
    try {
        const orders = await Order.findAll();

        if(orders[0]){

            let orderKeys = orders.length > 0 
            ? Object.keys(orders[0].dataValues).filter(key => !['createdAt', 'updatedAt'].includes(key))
            : [];

        
     let orderTable = `
             <thead>
                 <tr>
                    <th></th> ${orderKeys.map(key => `<th>${key}</th>`).join('')}
                 </tr>
             </thead>
             <tbody>

                 ${orders.map(order => `
                     
                     <tr>
                     <td colspan="1">
                            <input type="checkbox" name="orderCheckbox" value="${order.id}" />
                        </td>
                        ${orderKeys.map(key => `<td>${(order as any)[key]}</td>`).join('')}
                        <td colspan="1"><button id="modifier" value="${order.id}" name="">Modifier</button></td>
                     </tr>
                 `).join('')}
             </tbody>
     `;
     res.send(orderTable);
        }else{
            res.send(`<h1>Aucune commande</h1>`)
        }
   
        


    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
    
    
    
    ;
    


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
