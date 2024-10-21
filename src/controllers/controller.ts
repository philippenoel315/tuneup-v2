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


export async function submitOrder(req: Request, res: Response) {
  try {
    const {id, name, email, address, phoneNumber, ski_brand, ski_model, ski_length, service, status, notes }: OrderAttributes = req.body;


    const emailData: OrderAttributes = {
    id, name, email, address, phoneNumber, ski_brand, ski_model, ski_length, service, status,
      notes
    };
try{
 const order = await Order.create(emailData);
 const thankYouHtml = await ejs.renderFile(
  path.join(__dirname, '..', '..', 'static', 'thank-you.ejs'), 
  order
);

const confirmationHtml = await ejs.renderFile(
  path.join(__dirname, '..', '..', 'static', 'email', 'confirmation.ejs'),
  {id:order.id, name: name, email: email, service: service, ski_length: ski_length, notes: notes}
);
const options:EmailOptions = {to: email, subject: 'Confirmation de votre demande - Affûtage Pro', text: 'Confirmation', html: confirmationHtml};

await sendEmail(options);

res.status(200).send(thankYouHtml);
}
catch(error:any){
  throw new Error(error);
}

  } catch (error) {
    console.error('Error submitting order:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('An error occurred while fetching orders.');
  }
};

export const authenticate = (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      // res.status(200).send(adminHtml);
    } else {
      res.sendFile(join(__dirname, '..', '..', 'static', 'authenticateHtml.html'));
    }
  } catch (error) {
    console.error('Error submitting auth:', error);
    res.status(500).send('An error occurred while submitting auth.');
  }
};

export const adminDashboard = async (req: Request, res: Response) => {


};




export const sendOrderEmail = async (data: OrderAttributes) => {
  try {
    const{
      name,
      email,
      service,
      ski_brand,
      ski_model,
      ski_length,
      notes,
      phoneNumber 
    }=data;

    const requestedDate = new Date().toLocaleDateString('fr-FR');
    const services = [{ name: service }];
    const html = await ejs.renderFile(path.join(__dirname, '..', '..', 'static', 'email', 'order.ejs'), {
      name,
      email,
      service,
      ski_brand,
      ski_model,
      ski_length,
      notes,
      phoneNumber 
    });

    const subject = `Nouvelle Commande - Affûtage Pro`;
    
    await sendEmail({ to: process.env.EMAIL_USER||'', subject, text: '', html });
  } catch (error) {
    console.error('Error sending order details email:', error);
    throw new Error('An error occurred while sending the order details email.');
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, newStatus } = req.body;

    // const updatedOrder = await Order.update(
    //   { status: newStatus },
    //   {
    //     where: { order_id: orderId },
    //     returning: true,              
    //     plain: true                    
    //   }
    // );
    
    // Access the updated order using `updatedOrder`
    // const updatedOrderData = updatedOrder[1].get(); // `updatedOrder[1]` is the updated row
    

    // if (!updatedOrder) {
    //   return res.status(404).json({ success: false, message: 'Order not found' });
    // }

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};