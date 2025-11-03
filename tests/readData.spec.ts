import fs from 'fs';
import { test, expect } from "@playwright/test";
import { getConnection } from '../utils/conection';
import Papa from 'papaparse';
import { RowDataPacket } from 'mysql2';


let connection: any;

test.describe('YOURLS API',() =>{
const fs = require("fs");
const Papa = require("papaparse");

//before all
 test.beforeAll(async () => {
   connection = await getConnection();
   console.log('Database connection established');
 });

)};