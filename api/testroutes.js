const express = require('express');
const path = require('path');
const ejs = require('ejs');
const { sql } = require('@vercel/postgres');
const { sendOrderEmail, sendConfirmationEmail } = require('./mailer');

const router = express.Router();

router.get('/confirmation-email', async (req, res) => {
  const mockData = {
    idCommande: 'TEST123',
    name: 'John Doe',
    email: 'test@example.com',
    service: 'Ski Tuning',
    skisCount: 2,
    requestedDate: '2024-03-20',
    notes: 'Please be careful with the bindings.'
  };

  try {
    await sendConfirmationEmail(mockData);
    res.send('Test confirmation email sent successfully!');
  } catch (error) {
    console.error('Error sending test confirmation email:', error);
    res.status(500).send('Error sending test confirmation email.');
  }
});

router.get('/order-email', async (req, res) => {
  const mockData = {
    orderId: 'ORDER456',
    name: 'Jane Smith',
    email: 'admin@affutagepro.com',
    service: 'Edge Sharpening',
    pairsCount: 3,
    notes: 'Customer requested extra wax.',
    phone: '123-456-7890'
  };

  try {
    await sendOrderEmail(mockData);
    res.send('Test order email sent successfully!');
  } catch (error) {
    console.error('Error sending test order email:', error);
    res.status(500).send('Error sending test order email.');
  }
});

router.get('/submit-order', async (req, res) => {
  const mockOrderData = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    service: 'Full Tune-up',
    skisCount: 1,
    requestedDate: '2024-04-01'
  };

  try {
    const orderId = Date.now().toString();

    await sql`
      INSERT INTO orders (order_id, name, email, service, skis_count, requested_date)
      VALUES (${orderId}, ${mockOrderData.name}, ${mockOrderData.email}, ${mockOrderData.service}, ${mockOrderData.skisCount}, ${mockOrderData.requestedDate})
    `;

    const emailData = {
      orderId,
      ...mockOrderData
    };

    const confirmationHtml = await ejs.renderFile(
      path.join(__dirname, '..', 'static', 'email', 'confirmation-page.ejs'), 
      emailData
    );

    await sendOrderEmail(emailData);
    await sendConfirmationEmail(emailData);

    res.send(confirmationHtml);
  } catch (error) {
    console.error('Error in test submit order:', error);
    res.status(500).send('An error occurred while testing order submission.');
  }
});

router.get('/get-orders', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM orders ORDER BY requested_date DESC LIMIT 10`;
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching test orders:', error);
    res.status(500).send('An error occurred while fetching test orders.');
  }
});

router.post('/send-order', async (req, res) => {
    sendOrderEmail(req.body)
  });
  
  router.post('/send-confirmation', async (req, res) => {
    sendConfirmationEmail(req.body);
  });

module.exports = router;