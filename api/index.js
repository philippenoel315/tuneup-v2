const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'static')));
app.use(express.static(path.join(__dirname, '..', 'assets')));


app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'form.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'welcome.html'));
});


// Updated submit route (without database interaction)
app.post('/submit', (req, res) => {
  try {
    const { name, email, service, notes, 'ajouter-paires': additionalPairs, ...rest } = req.body;
    
    // Process additional pairs
    const additionalPairsData = Object.keys(rest)
      .filter(key => key.startsWith('service-ski-pair-'))
      .map(key => {
        const pairId = key.replace('service-', '');
        return {
          service: rest[key],
          notes: rest[`notes-${pairId}`]
        };
      });

    // Here you would typically save the data to a database
    // For now, we'll just log it to the console
    console.log('Form data:', { name, email, service, notes, additionalPairsData });

    res.send('Form submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('An error occurred while submitting the form.');
  }
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
