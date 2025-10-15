import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'yourls',
  });
}