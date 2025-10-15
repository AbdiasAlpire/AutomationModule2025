import { test, expect } from '@playwright/test';
import { getConnection } from './database_connection';

let connection: any;

test.beforeAll(async () => {
  connection = await getConnection();
  console.log('Connection established');
});

test.afterAll(async () => {
  await connection?.end();
  console.log('Connection closed');
});

// 1) All columns: table is not empty
test('1) Should retrieve all records from yourls_url', async () => {
  const [rows] = await connection.execute('SELECT * FROM yourls_url;');
  const count = (rows as any[]).length;
  console.log(`Test 1: total rows = ${count}`);
  expect(Array.isArray(rows) && count).toBeGreaterThan(0);
});

// 2) First row: LIMIT 1 returns one row
test('2) Should return only the first row', async () => {
  const [rows] = await connection.execute('SELECT * FROM yourls_url LIMIT 1;');
  console.log('Test 2: first row =', (rows as any[])[0]);
  expect((rows as any[])).toHaveLength(1);
});

// 3) Search by keyword: at least one row exists
test('3) Should find a record by a specific keyword', async () => {
  const keyword = 'yourls'; // hardcoded
  const [rows] = await connection.execute(
    'SELECT * FROM yourls_url WHERE keyword = ?;',
    [keyword]
  );
  const count = (rows as any[]).length;
  console.log(`Test 3: keyword="${keyword}", rows found = ${count}`);
  if (count > 0) {
    console.log('Test 3: sample rows =', (rows as any[]).slice(0, 2));
  }
  expect(count).toBeGreaterThanOrEqual(1);
});

// 4) Filter by timestamp: all results within range
test('4) Should filter records within a timestamp range', async () => {
  const start = '2020-01-01 00:00:00';
  const end   = '2025-12-31 23:59:59';

  const [rows] = await connection.execute(
    'SELECT timestamp FROM yourls_url WHERE timestamp BETWEEN ? AND ?;',
    [start, end]
  );

  const rs = rows as any[];
  console.log(`Test 4: range [${start} .. ${end}], rows = ${rs.length}`);
  expect(rs.length).toBeGreaterThan(0);

  const tStart = new Date(start).getTime();
  const tEnd   = new Date(end).getTime();

  for (const r of rs) {
    const t = new Date(r.timestamp).getTime();
    console.log('Test 4: row timestamp =', r.timestamp, 'ms =', t);
    expect(t).toBeGreaterThanOrEqual(tStart);
    expect(t).toBeLessThanOrEqual(tEnd);
  }
});

// 5) Primary key: "keyword" is PK
test('5) Should verify that "keyword" is the primary key', async () => {
  const [rows] = await connection.execute(
    `SHOW KEYS FROM yourls_url WHERE Key_name = 'PRIMARY' AND Column_name = 'keyword';`
  );

  const cols = (rows as any[]).map(r => String(r.Column_name || r.COLUMN_NAME));
  console.log('Test 5: PK rows =', rows);
  console.log('Test 5: PK columns detected =', cols);

  expect((rows as any[]).length).toBeGreaterThan(0);
  expect(cols.map(c => c.toLowerCase())).toContain('keyword');
});

// 6) Clicks > 10: if rows exist, all are >= 11
test('6) Should return records where clicks are greater than 10', async () => {
  const min = 10;
  const [rows] = await connection.execute(
    'SELECT clicks FROM yourls_url WHERE clicks > ?;',
    [min]
  );

  const rs = rows as any[];
  console.log(`Test 6: clicks > ${min}, rows = ${rs.length}`);
  if (rs.length > 0) {
    console.log('Test 6: sample rows =', rs.slice(0, 3));
    for (const r of rs) expect(r.clicks).toBeGreaterThan(min);
  } else {
    console.log('Test 6: no rows with clicks > 10 (this is acceptable).');
  }
});

// 7) Count per IP: grouped counts match a direct COUNT(*)
test('7) Should count records for each IP address correctly', async () => {
  const [grouped] = await connection.execute(`
    SELECT ip, COUNT(*) AS record_count
    FROM yourls_url
    GROUP BY ip
    HAVING COUNT(*) > 0;
  `);

  const groups = grouped as any[];
  console.log('Test 7: groups by IP =', groups);
  expect(groups.length).toBeGreaterThan(0);

  const ip = groups[0].ip;
  const expected = groups[0].record_count;
  console.log(`Test 7: verifying ip=${ip}, expected=${expected}`);

  const [check] = await connection.execute(
    'SELECT COUNT(*) AS actual_count FROM yourls_url WHERE ip = ?;',
    [ip]
  );

  const actual = (check as any[])[0].actual_count;
  console.log(`Test 7: actual=${actual}`);
  expect(actual).toBe(expected);
});

