const fs = require('fs').promises;
const path = require('path');
const kuzu_wasm = require('@kuzu/kuzu-wasm');
const { getImportQueries } = require('../ldbc-sf01/get_query');

async function initializeWasmConnection() {
  const csvPath = path.resolve(__dirname, '..', 'ldbc-sf01', 'csv');
  const targetDir = '/data';
  const importQueries = getImportQueries(targetDir);

  const kuzu = await kuzu_wasm();

  // Create data directory
  if (!kuzu.FS.analyzePath(targetDir).exists) {
    kuzu.FS.mkdir(targetDir);
  }

  // Copy csv files to wasm fs
  try {
    const files = await fs.readdir(csvPath);
    const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');

    console.log("start to copy file to wasm")
    for (const file of csvFiles) {
      const filePath = path.join(csvPath, file);
      const content = await fs.readFile(filePath, 'utf8');
      const targetFilePath = path.join(targetDir, file);
      kuzu.FS.writeFile(targetFilePath, content);
      // console.log(`File ${file} copied to ${targetFilePath}`);
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }

  const db = new kuzu.WebDatabase("memDB", 0, 0, false, false, 4194304 * 16 * 4);
  const conn = new kuzu.WebConnection(db, 0);

  for (const query of importQueries) {
    await conn.query(query);
  }
  
  return conn;
}

const conn_wasm_promise = initializeWasmConnection();

module.exports = { conn_wasm_promise };