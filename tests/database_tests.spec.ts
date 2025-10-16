import {test, expect} from '@playwright/test';
import { getConnection } from './conection';
import { RowDataPacket } from 'mysql2';

let connection: any;

test.describe('YOURLS Queries',() =>{

//before all
  test.beforeAll(async () => {
    connection = await getConnection();
    console.log('Database connection established');
  });

  //after all

  test.afterAll(async () => {
    await connection.end();
    console.log('Database connection closed');
  });

//All columns
test('All collums of yourls_url', async()=>{
    const [rows] = await connection.execute<RowDataPacket[]>(
        'select * from yourls_url yu;');
    console.log('Total rows: ', rows.length);
    expect(rows.length).toBeGreaterThan(0);
});

//First row
test('First row of yourls_url', async() => {
    const [row] = await connection.execute<RowDataPacket[]>(
        'select * from yourls_url yu Limit 1;'
    );
    expect(row.length).toBe(1);
    console.log('Number of rows: ', row.length);
});

//Search by keyword
test('Search by keyword = farmacorp',async() => {
    const keywordSearch = 'farmacorp';
    const [rows] = await connection.execute<RowDataPacket[]>(
        'select *  from yourls_url yu where yu.keyword = ?;',[keywordSearch]
    );
    expect(rows.length).toBeGreaterThan(0);
    for(const row of rows ){
        expect(row.keyword).toBe(keywordSearch);
         console.log(keywordSearch,'=', row.keyword);
    }
    console.log('number of rows: ', rows.length);
   
  });

//Filter by timestamp
test('filter by timestamp', async() => {
    const start = '2025-10-15 00:22:36';
    const ends = '2025-10-15 00:25:36';
    const [rows] = await connection.execute<RowDataPacket[]>(
        'select * from yourls_url yu  where yu.timestamp BETWEEN ? and ?;',[start,ends]
    );
    console.log('Number of rows:', rows.length);
});

//Primary key check
test('Test the primary key yourls_url', async() =>{
    const primaryKey = 'PRIMARY';
    const [rows] =await connection.execute<RowDataPacket[]>(
        'show keys from yourls_url where key_name= ?',[primaryKey]
    );
    const row = rows[0];
    expect(row.Key_name).toBe(primaryKey);
    console.log('The key is:', row.Key_name);
});

//Clicks > 10
test('Test links with more than 10 clicks', async() =>{
    const [rows] =await connection.execute<RowDataPacket[]>(
        'SELECT clicks FROM yourls_url WHERE clicks > 10;'
    );

    for (const row of rows) {
      expect(row.clicks).toBeGreaterThanOrEqual(11);
    }
    console.log(`Rows with clicks > 10: ${rows.length}`);
});


//Count per IP
  test('Count per IP matches expectations', async () => {
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT ip, COUNT(*) AS count FROM yourls_url GROUP BY ip;'
    );
    console.table(rows);
    for (const row of rows) {
      expect(row.count).toBeGreaterThan(0);
    }
  });

  //test create a short URL
  test('Create a new short URL', async({request}) =>{
    const apiUrl = 'http://localhost:8080/yourls-api.php';
    const params = new URLSearchParams({
        signature: 'caed1384a5',
        action: 'shorturl',
        url: 'https://www.canva.com/projects',
        keyword: 'canva',
        title: 'canva',
        format: 'json'  
    });
    const response = await request.get(`${apiUrl}?${params.toString()}`);
     console.log('Status:', response.status());
  const information = await response.json();
  console.log('Response:', information);
    expect(response.ok()).toBeTruthy();
    const data  = await response.json();
    const [rows] =  await connection.execute<RowDataPacket[]>(
        'SELECT * FROM yourls_url yu where yu.keyword = ? and yu.title = ? and yu.url = ?', ['canva', 'canva', 'https://www.canva.com/projects']
    );
   expect(rows.length).toBeGreaterThan(0);
   expect(rows[0]).toMatchObject({
        url: 'https://www.canva.com/projects',
        keyword: 'canva',
        title: 'canva',
   });
  });
});