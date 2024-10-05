const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sendEmail } = require('./mailer');
const ejs = require('ejs');
const fs = require('fs').promises;
const testRoutes = require('./testroutes');

// Import both PostgreSQL clients
const { sql: vercelSql } = require('@vercel/postgres');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Choose the appropriate SQL client based on the environment
const isProduction = process.env.NODE_ENV === 'production';
let sql;

if (isProduction) {
  sql = vercelSql;
} else {
  // Configure the connection to your local PostgreSQL database
  const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432,
  });

  sql = pool.query.bind(pool);
}

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'static')));
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.use('/test', testRoutes);

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

// Route to get all orders
app.get('/orders', async (req, res) => {
  try {
    let result;
    if (isProduction) {
      result = await sql`
        SELECT o.order_id, u.name AS user_name, s.name AS ski_name, 
               o.order_date, o.status, o.total_price, o.notes
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN ski s ON o.ski_id = s.id
        ORDER BY o.order_date DESC
      `;
    } else {
      const { rows } = await sql(`
        SELECT o.order_id, u.name AS user_name, s.name AS ski_name, 
               o.order_date, o.status, o.total_price, o.notes
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN ski s ON o.ski_id = s.id
        ORDER BY o.order_date DESC
      `);
      result = rows;
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('An error occurred while fetching orders.');
  }
});

async function sendConfirmationEmail(data) {
  try {
    const {idCommande, name, email, service, skisCount, requestedDate, notes } = data;
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



app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
