const path = require('path');
const ejs = require('ejs');
const { insertOrder, getOrders } = require('../db/orderqueries');
const { sendEmail } = require('../mailer');

exports.submitOrder = async (req, res) => {
  try {
    const { name, email, service, skisCount, requestedDate } = req.body;
    
    // Generate a simple order ID
    const orderId = Date.now().toString();

    // Insert order into database
    await insertOrder(orderId, name, email, service, skisCount, requestedDate);

    // Prepare data for emails and confirmation page
    const emailData = {
      orderId,
      name,
      email,
      service,
      skisCount,
      requestedDate
    };

    // Render the EJS template for the confirmation page
    const confirmationHtml = await ejs.renderFile(
      path.join(__dirname, '..', '..', 'static', 'email', 'confirmation-page.ejs'), 
      emailData
    );

    // Send emails
    await this.sendOrderEmail(emailData);
    await this.sendConfirmationEmail(emailData);

    // Send the confirmation page to the client
    res.send(confirmationHtml);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('An error occurred while submitting the form. Please contact Affûtage Pro by email.');
  }
};

exports.getOrders = async (req, res) => {
  try {
    const result = await getOrders();
    const orders = result.rows;
console.log(orders)
    const html = await ejs.renderFile(
      path.join(__dirname, '..', '..', 'static', 'orders-table.ejs'), 
      { orders }
    );

    res.send(html);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('An error occurred while fetching orders.');
  }
};

exports.sendConfirmationEmail = async (data) => {
  try {
    const {idCommande, name, email, service, skisCount, requestedDate, notes } = data;
    const html = await ejs.renderFile(path.join(__dirname, '..', '..', 'static', 'email', 'confirmation.ejs'), {
     idCommande,
      name,
      service,
      skisCount: skisCount,
      requestedDate,
      notes
    });

    const subject = 'Confirmation de votre demande - Affûtage Pro';
    
    await sendEmail(email, subject, '', html);
    console.log('Confirmation email sent successfully!');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('An error occurred while sending the confirmation email.');
  }
};

exports.sendOrderEmail = async (data) => {
  try {
    const {orderId, name, email, service, pairsCount, notes, phone } = data;
    const requestedDate = new Date().toLocaleDateString('fr-FR');
    const services = [{ name: service, quantity: pairsCount }];
    const html = await ejs.renderFile(path.join(__dirname, '..', '..', 'static', 'email', 'order.ejs'), {
      orderId,
      name,
      email,
      phone: 'Non fourni',
      requestedDate,
      pairsCount,
      services,
      notes
    });

    const subject = `Nouvelle Commande - Affûtage Pro`;
    
    await sendEmail('admin@affutagepro.com', subject, '', html);
    console.log('Order details email sent successfully!');
  } catch (error) {
    console.error('Error sending order details email:', error);
    throw new Error('An error occurred while sending the order details email.');
  }
};