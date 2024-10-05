const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs').promises;
const testRoutes = require('./test/testroutes');
const routes = require('./routes/routes');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'static')));
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.use('/test', testRoutes);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'static', 'email'));

// Use the routes from routes.js
app.use('/', routes);

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
