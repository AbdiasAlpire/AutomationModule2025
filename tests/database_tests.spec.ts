import {test, expect} from '@playwright/test';
import { getConnection } from './conection';
import { RowDataPacket } from 'mysql2';

test.describe('YOURLS Queries',() =>{

//All columns
test('All collums of yourls_url', async()=>{
    const conection = await getConnection();
    const [rows] = await conection.execute<RowDataPacket[]>(
        'select * from yourls_url yu;'
    );
    console.log('Total rows: ', rows.length);
    expect(rows.length).toBeGreaterThan(0);
    await conection.end();
});

//First row
test('First row of yourls_url', async() => {
    const conection = await getConnection();
    const [row] = await conection.execute<RowDataPacket[]>(
        'select * from yourls_url yu Limit 1;'
    );
    expect(row.length).toBe(1);
    console.log('Number of rows: ', row.length);
    await conection.end();
});

//Search by keyword
test('Search by keyword = ozh',async() => {
    const conection = await getConnection();
    const keywordSearch = 'ozh';
    const [rows] = await conection.execute<RowDataPacket[]>(
        'select *  from yourls_url yu where yu.keyword = "ozh";'
    );
    console.log('Rows found by keyword: ', rows.length);
    expect(rows.length).toBeGreaterThan(0);
    await conection.end();
});

//Filter by timestamp
test('filter by timestamp', async() => {
    const conection = await getConnection();
    const start = '2025-10-15 00:22:36';
    const ends = '2025-10-16 00:25:36';
    const [rows] = await conection.execute<RowDataPacket[]>(
        'select * from yourls_url yu  where yu.timestamp BETWEEN ? and ?;',[start,ends]
    );
    console.log('Number of rows:', rows.length);
    await conection.end();
});

//Primary key check
test('Test the primary key yourls_url', async() =>{
    const conection = await getConnection();
    const primaryKey = 'PRIMARY';
    const [rows] =await conection.execute<RowDataPacket[]>(
        'show keys from yourls_url where key_name= ?',[primaryKey]
    );
    await conection.end();
});

//Clicks > 10
test('Test links with more than 10 clicks', async() =>{
    const conection = await getConnection();
    const [rows] =await conection.execute<RowDataPacket[]>(
        'SELECT clicks FROM yourls_url WHERE clicks > 10;'
    );

    for (const row of rows) {
      expect(row.clicks).toBeGreaterThanOrEqual(11);
    }
    console.log(`Rows with clicks > 10: ${rows.length}`);
    await conection.end();
});


//Count per IP
  test('Count per IP matches expectations', async () => {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT ip, COUNT(*) AS count FROM yourls_url GROUP BY ip;'
    );

    console.table(rows);

    for (const row of rows) {
      expect(row.count).toBeGreaterThan(0);
    }

    await connection.end();
  });

});