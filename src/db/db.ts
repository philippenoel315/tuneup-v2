import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

let sequelize: Sequelize;

if (false) {
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
} else {
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
  // sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  //   host: process.env.DB_HOST,
  //   port: parseInt(process.env.DB_PORT || '5432'),
  //   dialect: 'postgres',
  // });
}

sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch((err: Error) => console.error('Unable to connect to the database:', err));

export default sequelize;