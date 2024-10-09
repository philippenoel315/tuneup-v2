import path from 'path';
import { fileURLToPath } from 'url';
import { EmailOptions } from '../types/types.js';
import ejs from 'ejs';
import { Request, Response } from 'express';
import { sendEmail } from '../mailer.js';
import Order from '../models/order.js';
import { OrderAttributes } from '../types/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function submitOrder(req: Request, res: Response) {
  try {
    const { name, email, phoneNumber, ski_brand, ski_model, ski_length, service, status, notes }: OrderAttributes = req.body;
    console.log(req.body);  

    const emailData: OrderAttributes = {
      name, email, phoneNumber, ski_brand, ski_model, ski_length, service, status,
      notes: '' // Use nullish coalescing operator
    };
try{
  await Order.create(emailData);
}
catch(error){
  throw new Error(error);
}
   
 
    

//Template de confirmation

    // const confirmationHtml = await ejs.renderFile(
    //   path.join(__dirname, '..', '..', 'static', 'email', 'thank-you.ejs'), 
    //   emailData
    // );



        const confirmationHtml = await ejs.renderFile(
      path.join(__dirname, '..', '..', 'static', 'email', 'confirmation.ejs'), 
      {name: name, email: email, service: service, ski_length: ski_length, notes: notes}
    );
const options:EmailOptions = {to: email, subject: 'Confirmation de votre demande - Affûtage Pro', text: 'Confirmation', html: confirmationHtml};

   await sendEmail(options);

    // Send the response only once
    res.status(200).json({ message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Error submitting order:', error);
    // Only send error response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    // Implementation here
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('An error occurred while fetching orders.');
  }
};

// export const sendConfirmationEmail = async (data: OrderAttributes) => {
//   try {
//     const { id, name, email, service, ski_length, order_date, notes } = data;
//     const html = await ejs.renderFile(path.join(__dirname, '..', '..', 'static', 'email', 'confirmation.ejs'), {
//       id,
//       name,
//       service,
//       skisCount,
//       requestedDate,
//       notes
//     });

//     const subject = 'Confirmation de votre demande - Affûtage Pro';
    
//     await sendEmail({ to: email, subject, text: '', html });
//     console.log('Confirmation email sent successfully!');
//   } catch (error) {
//     console.error('Error sending confirmation email:', error);
//     throw new Error('An error occurred while sending the confirmation email.');
//   }
// };

// export const sendOrderEmail = async (data: OrderEmailData) => {
//   try {
//     const { orderId, name, email, service, pairsCount, notes, phone } = data;
//     const requestedDate = new Date().toLocaleDateString('fr-FR');
//     const services = [{ name: service, quantity: pairsCount }];
//     const html = await ejs.renderFile(path.join(__dirname, '..', '..', 'static', 'email', 'order.ejs'), {
//       orderId,
//       name,
//       email,
//       phone: phone || 'Non fourni',
//       requestedDate,
//       pairsCount,
//       services,
//       notes
//     });

//     const subject = `Nouvelle Commande - Affûtage Pro`;
    
//     await sendEmail({ to: 'admin@affutagepro.com', subject, text: '', html });
//     console.log('Order details email sent successfully!');
//   } catch (error) {
//     console.error('Error sending order details email:', error);
//     throw new Error('An error occurred while sending the order details email.');
//   }
// };

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