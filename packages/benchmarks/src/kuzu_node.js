const fs = require('fs');
const path = require('path');
const kuzu = require("kuzu");

const { getImportQueries } = require('../ldbc-sf01/get_query');
const csvPath = path.resolve(__dirname, '..', 'ldbc-sf01', 'csv');
const importQueries = getImportQueries(csvPath);
const dbName = "test";
const databasePath = path.join(process.cwd(), dbName);

// Clean database
fs.rmSync(databasePath, { recursive: true, force: true });

console.log("CsvPath is located in:", csvPath);

// Create an empty database and connect to it
const db = new kuzu.Database(dbName);
const version = kuzu.Database.getVersion()
const conn = new kuzu.Connection(db);

async function setup() {
  for (const query of importQueries) {
    console.log("kuzu-node:" + query);
    await conn.query(query);
  }
  return conn;
}

function afterAll(){
  // Clean database
  fs.rmSync(databasePath, { recursive: true, force: true });
}

const conn_node_promise = setup();
module.exports = { conn_node_promise, version, afterAll};
