import { test, expect } from "@playwright/test";
import { getConnection } from "../utils/conection";
import { RowDataPacket } from "mysql2";

let connection: any;

//before all
test.beforeAll(async () => {
  connection = await getConnection();
  console.log("Database connection established");
});

//test create a short URL
test("Create a new short URL", async ({ request }) => {
  const apiUrl = "http://localhost:8080/yourls-api.php";
  const params = new URLSearchParams({
    signature: "caed1384a5",
    action: "shorturl",
    url: "https://www.canva.com/projects",
    keyword: "canva",
    title: "canva",
    format: "json",
  });
  const response = await request.get(`${apiUrl}?${params.toString()}`);
  console.log("Status:", response.status());
  const information = await response.json();
  console.log("Response:", information);
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  const [rows]: [RowDataPacket[]] = await connection.execute(
    "SELECT * FROM yourls_url yu where yu.keyword = ? and yu.title = ? and yu.url = ?",
    ["canva", "canva", "https://www.canva.com/projects"]
  );
  expect(rows.length).toBeGreaterThan(0);
  expect(rows[0]).toMatchObject({
    url: "https://www.canva.com/projects",
    keyword: "canva",
    title: "canva",
  });

  //read a CSV
  
});
