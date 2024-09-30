const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sendEmail } = require('./mailer');
const ejs = require('ejs');
const fs = require('fs').promises;  // Add this line


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

// Updated submit route with email sending
app.post('/submit', async (req, res) => {
  try {
    const { name, email, service, notes, 'ajouter-paires': additionalPairs, ...rest } = req.body;
    
await sendOrderEmail(req.body);
await sendConfirmationEmail(req.body);

    await res.send('Formulaire envoyé avec succès. Vous recevrez un courriel de confirmation.');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire:', error);
    res.status(500).send('Erreur lors de l\'envoi du formulaire. veuillez contacter Affûtage Pro par courriel.');
  }
});



async function sendConfirmationEmail(data) {
  try {
    const { name, email, service, skisCount, requestedDate } = data;
console.log(data);  
    const html = await ejs.renderFile(path.join(__dirname, '..', 'static', 'email', 'confirmation.ejs'), {
      name,
      service,
      skisCount: skisCount,
      requestedDate
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
  sendOrderEmail(data)
});

app.post('/send-confirmation', async (req, res) => {
  sendConfirmationEmail(req.body);
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
