# Fetch from the Network
Here introduce the method use JavaScript's `fetch` API to load remote files directly into the virtual file system.
::: warning
This approach may be affected by CORS policy.
:::

## Usage
To fetch a file from the network and write it to the Emscripten file system, you can use the following approach:
```javascript
const response = await fetch("https://raw.githubusercontent.com/kuzudb/kuzu/master/dataset/demo-db/csv/follows.csv");
const dataArrayBuffer = new Uint8Array(await response.arrayBuffer());
kuzu.FS.writeFile("/follows.csv", dataArrayBuffer);
```
This code fetches a `CSV` file from the network, converts it to a format that Emscripten’s file system can handle `Uint8Array`, and writes it into the virtual file system.

## Full Example
The following example demonstrates fetching a `CSV` file from a remote URL, storing it in the Emscripten file system, and importing it into a `Kuzu` database. 

```javascript
// Step 1: Initialize the Kuzu Database
const db = await kuzu.Database();

// Step 2: Create a connection to the database
const conn = await kuzu.Connection(db);

// Step 3: Fetch the CSV file from a remote server
const response = await fetch("https://raw.githubusercontent.com/kuzudb/kuzu/master/dataset/demo-db/csv/follows.csv");
const dataArrayBuffer = new Uint8Array(await response.arrayBuffer());

// Step 4: Write the fetched file to the Emscripten virtual file system
kuzu.FS.writeFile("/follows.csv", dataArrayBuffer);

// Step 5: Read the content of the file from the virtual file system to verify
const fileContent = kuzu.FS.readFile("/follows.csv", { encoding: 'utf8' });
console.log("File Content:\n", fileContent);

// Step 6: Create a table for the 'Follows' data in the database
await conn.execute("CREATE NODE TABLE Follows(user1 STRING, user2 STRING)");

// Step 7: Import data from the fetched CSV file into the 'Follows' table
await conn.execute('COPY Follows FROM "/follows.csv";');
```