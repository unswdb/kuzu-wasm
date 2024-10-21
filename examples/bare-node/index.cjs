const kuzu_wasm = require('@kuzu/kuzu-wasm');
const path = require('path');
const DUCKDB_DIST = path.dirname(require.resolve('@kuzu/kuzu-wasm'));

(async () => {
    const kuzu = await kuzu_wasm();
    const db = new kuzu.WebDatabase("memDB", 0, 0, false, false, 4194304 * 16 * 8);
    const conn = new kuzu.WebConnection(db, 0);
    await conn.query(`CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))`)
    await conn.query(`CREATE (u:User {name: 'Alice', age: 35});`)
    const res = await conn.query(`MATCH (a:User) RETURN a.*;`)
    console.log(res.toString())
})();