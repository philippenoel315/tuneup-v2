const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const port = 3001;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'static')));
app.use(express.static(path.join(__dirname,'..', 'assets')));


// Database setup
let db;
(async () => {
  db = await open({
    filename: 'ski_service.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ski_service_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      service TEXT,
      notes TEXT,
      additional_pairs JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'form.html'));
});

app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'welcome.html'));
});

app.get('/', (req, res) => {
  res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome</title></head><body><h1>Hello World</h1></body></html>');
});


// Updated submit route
app.post('/submit', async (req, res) => {
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

    await db.run(
      `INSERT INTO ski_service_requests (name, email, phone, service, notes, additional_pairs)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, service, notes, JSON.stringify(additionalPairsData)]
    );

    res.send('Form submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('An error occurred while submitting the form.');
  }
});

app.set('view engine', 'ejs');

function formatAdditionalPairs(pairs) {
  if (!pairs || pairs.length === 0) return 'None';
  return pairs.map((pair, index) => 
    `Pair ${index + 1}: ${pair.service} (Notes: ${pair.notes || 'None'})`
  ).join('; ');
}

app.get('/requests', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM ski_service_requests ORDER BY created_at DESC');
    console.log(rows);  
    rows.forEach(row => {
      if (row.additional_pairs) {
        row.additional_pairs = formatAdditionalPairs(JSON.parse(row.additional_pairs));
      }
    });

    res.render('requests', { requests: rows });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('An error occurred while fetching the requests.');
  }
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
