# Writing to File in Emscripten
Emscripten provides the [`writeFile`](https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.writeFile) to write data to the virtual file system. 

## Usage
To write a file in the Emscripten file system, you can use the following syntax:
```javascript
kuzu.FS.writeFile(path, data);
```
- `path` (string) – The file to which to write data.
- `data` (string|ArrayBufferView) – The data to write. A string will always be decoded as UTF-8.

## Example
```javascript
kuzu.FS.writeFile("/user.csv", "Adam,30\nKarissa,40\nZhang,50\nNoura,2");
```
This will create a file named user.csv in the virtual file system, containing four rows of user data (name and age).

### Full Example
Below is a complete example of how you can use the writeFile API to write a CSV file and import it into a Kuzu database:
```javascript
// Step 1: Initialize the Kuzu Database
const db = await kuzu.Database();

// Step 2: Create a new connection to the database
const conn = await kuzu.Connection(db);

// Step 3: Write data to the Emscripten virtual file system
kuzu.FS.writeFile("/user.csv", "Adam,30\nKarissa,40\nZhang,50\nNoura,2");

// Step 4: Read the content of the file from the virtual file system to verify
const fileContent = kuzu.FS.readFile("/user.csv", { encoding: 'utf8' });
console.log("File Content:\n", fileContent);

// Step 5: Create a table for storing user data in the database
await conn.execute("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))");

// Step 6: Import data from the written file into the User table
await conn.execute('COPY User FROM "/user.csv";');
```

