import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

let sequelize: Sequelize;

if (true) {
  sequelize = new Sequelize(process.env.POSTGRES_URL!, {
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} 


sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch((err: Error) => console.error('Unable to connect to the database:', err));

export default sequelize;