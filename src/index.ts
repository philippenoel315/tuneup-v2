import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import router from './routes/routes.js';
import sequelize from './db/db.js';
import dotenv from 'dotenv';
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(join(__dirname, '..', 'static')));
app.use(express.static(join(__dirname, '..', 'assets')));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, '..', 'static', 'email'));

app.use('/', router);

// sequelize.sync({ alter: true })
//   .then(() => console.log('Database synced'))
//   .catch((err: Error) => console.error('Error syncing database:', err));

app.listen(process.env.PORT, () => {
  console.log(`App is running at http://localhost:${process.env.PORT}`);
});
//