import { test, expect } from '@playwright/test';
import mysql, { RowDataPacket } from 'mysql2/promise';

function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

test('Insertar short URL en la BD y obtener valores desde la API', async ({ request }) => {
  const randomSuffix = randomString(6);
  const keyword = `link${randomSuffix}`;
  const title = `TestLink${randomSuffix}`;
  const url = `https://testlink${randomSuffix}.com`;

  // Conexión a la BD
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yourlsv1',
  });

  await connection.execute(
    `INSERT INTO yourls_url (keyword, url, title, timestamp, clicks) 
     VALUES (?, ?, ?, NOW(), 0)`,
    [keyword, url, title]
  );

  console.log('Registro insertado en la BD:', { keyword, url, title });

  //Consultar la API para verificar valores actualizados
  const apiUrl = 'http://localhost:8080/yourls-api.php';
  const params = new URLSearchParams({
    signature: 'caed1384a5',
    action: 'version',
    format: 'json',
  });

  const response = await request.get(`${apiUrl}?${params.toString()}`);
  expect(response.ok()).toBeTruthy();

  // --- Validar que la BD contiene el registro recién insertado ---
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT keyword, url, title FROM yourls_url WHERE keyword = ? AND url = ? AND title = ?',
    [keyword, url, title]
  );

  const result = rows as RowDataPacket[];
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toMatchObject({ keyword, url, title });

  await connection.end();
});
