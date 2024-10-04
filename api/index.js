const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sendEmail } = require('./mailer');
const ejs = require('ejs');
const fs = require('fs').promises;
const { sql } = require('@vercel/postgres');

const app = express();
const port = 3001;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'static')));
app.use(express.static(path.join(__dirname, '..', 'assets')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'static', 'email'));

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'form.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'welcome.html'));
});

// Updated submit route with database integration
app.post('/submit', async (req, res) => {
  try {
    const { name, email, service, skisCount, requestedDate } = req.body;
    
    // Generate a simple order ID
    const orderId = Date.now().toString();

    // Insert order into database
    await sql`
      INSERT INTO orders (order_id, name, email, service, skis_count, requested_date)
      VALUES (${orderId}, ${name}, ${email}, ${service}, ${skisCount}, ${requestedDate})
    `;

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
      path.join(__dirname, '..', 'static', 'email', 'confirmation-page.ejs'), 
      emailData
    );

    // Send emails
    await sendOrderEmail(emailData);
    await sendConfirmationEmail(emailData);

    // Send the confirmation page to the client
    res.send(confirmationHtml);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('An error occurred while submitting the form. Please contact Affûtage Pro by email.');
  }
});

// New route to get all orders
app.get('/orders', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM orders ORDER BY requested_date DESC`;
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('An error occurred while fetching orders.');
  }
});

async function sendConfirmationEmail(data) {
  try {
    const {idCommande, name, email, service, skisCount, requestedDate, notes } = data;
console.log(data);  
    const html = await ejs.renderFile(path.join(__dirname, '..', 'static', 'email', 'confirmation.ejs'), {
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
}

async function sendOrderEmail(data) {
  try {
    const {orderId, name, email, service, pairsCount, notes, phone } = data;
    const requestedDate = new Date().toLocaleDateString('fr-FR');
    const services = [{ name: service, quantity: pairsCount }];
    const html = await ejs.renderFile(path.join(__dirname, '..', 'static', 'email', 'order.ejs'), {
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
}

app.post('/send-order', async (req, res) => {
  sendOrderEmail(req.body)
});

app.post('/send-confirmation', async (req, res) => {
  sendConfirmationEmail(req.body);
});

// Test route for confirmation email
app.get('/test-confirmation-email', async (req, res) => {
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

// Test route for order email
app.get('/test-order-email', async (req, res) => {
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

// Test route for submitting an order
app.get('/test-submit-order', async (req, res) => {
  const mockOrderData = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    service: 'Full Tune-up',
    skisCount: 1,
    requestedDate: '2024-04-01'
  };

  try {
    // Generate a simple order ID
    const orderId = Date.now().toString();

    // Insert mock order into database
    await sql`
      INSERT INTO orders (order_id, name, email, service, skis_count, requested_date)
      VALUES (${orderId}, ${mockOrderData.name}, ${mockOrderData.email}, ${mockOrderData.service}, ${mockOrderData.skisCount}, ${mockOrderData.requestedDate})
    `;

    // Prepare data for emails and confirmation page
    const emailData = {
      orderId,
      ...mockOrderData
    };

    // Render the EJS template for the confirmation page
    const confirmationHtml = await ejs.renderFile(
      path.join(__dirname, '..', 'static', 'email', 'confirmation-page.ejs'), 
      emailData
    );

    // Send emails
    await sendOrderEmail(emailData);
    await sendConfirmationEmail(emailData);

    // Send the confirmation page to the client
    res.send(confirmationHtml);
  } catch (error) {
    console.error('Error in test submit order:', error);
    res.status(500).send('An error occurred while testing order submission.');
  }
});

// Test route to get all orders
app.get('/test-get-orders', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM orders ORDER BY requested_date DESC LIMIT 10`;
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching test orders:', error);
    res.status(500).send('An error occurred while fetching test orders.');
  }
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
