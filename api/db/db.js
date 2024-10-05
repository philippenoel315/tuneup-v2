const { sql: vercelSql } = require('@vercel/postgres');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
// dotenv.config({ path: path.resolve(process.cwd(), envFile) });

dotenv.config();  

const isProduction = process.env.NODE_ENV === 'production';

let sql;

if (isProduction) {
  sql = vercelSql;
} else {

  console.log("Using local database...");

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  sql = pool.query.bind(pool);
}


module.exports = { sql };