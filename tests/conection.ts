import mysql, { Connection } from 'mysql2/promise';

export async function getConnection(): Promise<Connection> {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'yourlsv1',
    port: 8889,
  });
}