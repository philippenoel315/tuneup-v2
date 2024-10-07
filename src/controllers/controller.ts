import path from 'path';
import ejs from 'ejs';
import { Request, Response } from 'express';
import { sendEmail } from '../mailer.js';
import sequelize  from '../db/db.js';
import Order from '../models/order.js';

interface OrderData {
  user_name: string;
  email: string;
  service: string;
  skisCount: number;
  requestedDate: string;
}

interface EmailData extends OrderData {
  orderId: string;
}

interface ConfirmationEmailData {
  idCommande: string;
  name: string;
  email: string;
  service: string;
  skisCount: number;
  requestedDate: string;
  notes?: string;
}

interface OrderEmailData {
  orderId: string;
  name: string;
  email: string;
  service: string;
  pairsCount: number;
  notes?: string;
  phone?: string;
}

export const submitOrder = async (req: Request, res: Response) => {
  try {
    const { user_name, email, service, skisCount, requestedDate }: OrderData = req.body;
    
    const orderId = Date.now().toString();

    const emailData: EmailData = {
      orderId,
      user_name,
      email,
      service,
      skisCount,
      requestedDate
    };

    const confirmationHtml = await ejs.renderFile(
      path.join(__dirname, '..', '..', 'static', 'email', 'confirmation-page.ejs'), 
      emailData
    );

    res.send(confirmationHtml);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('An error occurred while submitting the form. Please contact Affûtage Pro by email.');
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    // Implementation here
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('An error occurred while fetching orders.');
  }
};

export const sendConfirmationEmail = async (data: ConfirmationEmailData) => {
  try {
    const { idCommande, name, email, service, skisCount, requestedDate, notes } = data;
    const html = await ejs.renderFile(path.join(__dirname, '..', '..', 'static', 'email', 'confirmation.ejs'), {
      idCommande,
      name,
      service,
      skisCount,
      requestedDate,
      notes
    });

    const subject = 'Confirmation de votre demande - Affûtage Pro';
    
    await sendEmail({ to: email, subject, text: '', html });
    console.log('Confirmation email sent successfully!');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('An error occurred while sending the confirmation email.');
  }
};

export const sendOrderEmail = async (data: OrderEmailData) => {
  try {
    const { orderId, name, email, service, pairsCount, notes, phone } = data;
    const requestedDate = new Date().toLocaleDateString('fr-FR');
    const services = [{ name: service, quantity: pairsCount }];
    const html = await ejs.renderFile(path.join(__dirname, '..', '..', 'static', 'email', 'order.ejs'), {
      orderId,
      name,
      email,
      phone: phone || 'Non fourni',
      requestedDate,
      pairsCount,
      services,
      notes
    });

    const subject = `Nouvelle Commande - Affûtage Pro`;
    
    await sendEmail({ to: 'admin@affutagepro.com', subject, text: '', html });
    console.log('Order details email sent successfully!');
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