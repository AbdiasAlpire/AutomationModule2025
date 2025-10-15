import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

let connection: mysql.Connection;

//This is a before hook
test.beforeAll(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'yourlsv1', 
  });
});

//This is an after hook
test.afterAll(async () => {
  await connection.end();
});


//Exercise 1
test('[T1] - Assert table is not empty', async () => {
  const [rows] = await connection.execute('CALL get_all_columns()');
  console.log('Datos obtenidos:', rows);
  expect(Array.isArray(rows)).toBeTruthy();
  expect((rows as any[]).length).toBeGreaterThan(0);//verify table is not empty
});


//Exercise 2 - First row: Query with LIMIT 1 → assert row is returned.
test('[T2] - Retrieve the first row', async () => {
  const [rows] = await connection.execute('CALL get_first_row()');
  console.log('Datos obtenidos:', rows);
  expect((rows as any[]).length).toBe(1);
});


//Exercise 3 - Search by keyword: Query WHERE keyword = ? → assert at least one row returned.
test('[T3] - Search by keyword', async () => {
  const keyword = 'ozh';
  const [rows] = await connection.execute('CALL get_by_keyword(?)',[keyword]);
  console.log('Datos obtenidos:', rows);
  expect(Array.isArray(rows)).toBeTruthy();
  expect((rows as any[]).length).toBeGreaterThan(0);
});


//Exercise 4 - Filter by timestamp: Query WHERE timestamp BETWEEN ? AND ? → assert returned rows are within range.
test('[T4] - Filt by timestamps', async () => {
  const date_start = '2025-10-10 22:54:02';
  const date_end = '2025-10-14 22:54:02';
  const [rows] = await connection.execute(
    'CALL get_by_timestamp_range(?, ?)',
    [date_start, date_end]
  );
  console.log('Datos obtenidos:', rows);
  const data = rows as any[];
  for (const r of data) {
    const t = new Date(r.timestamp);
    expect(t >= new Date(date_start) && t <= new Date(date_end)).toBeTruthy();
  }
});


//Exercise 5 - Primary key check: Function isPrimaryKey(table, column) → assert column is primary key.
test('[T5] - Primary key check', async () => {
  const [rows] = await connection.execute("CALL verify_primary_key()");
  console.log('Datos obtenidos:', rows);
  const primary = rows as any[];
  const isPrimary = primary.some(p => p.Column_name === 'keyword');
  expect(isPrimary).toBeTruthy();
});


//Exercise 6 - Clicks > 10: Query WHERE clicks > 10 → assert all returned clicks ≥ 11.
test('[T6] - Retrieve clicks > 10', async () => {
  const [rows] = await connection.execute('CALL get_clicks_gt(?)');
  console.log('Datos obtenidos:', rows);
  const data = rows as any[];
  for (const r of data) {
    expect(Number(r.clicks)).toBeGreaterThan(10);
  }
});


//Exercise 7 - Count per IP: Query SELECT ip, COUNT(*) FROM yourls_url GROUP BY ip → assert counts match expectations.
test('[T7] - Count per ip', async () => {
  const [rows] = await connection.execute('CALL count_by_ip()');
  console.log('Datos obtenidos:', rows);
  const data = rows as any[];
  expect(Array.isArray(data)).toBeTruthy();
  for (const r of data) {
    expect(Number(r.total)).toBeGreaterThanOrEqual(1);
  }
});