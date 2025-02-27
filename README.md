
> This project has been archived. The latest official version can be found at <a href="https://docs.kuzudb.com/client-apis/wasm">Kùzu WASM Page</a> (Kùzu Team)

<div align="center">
  <img src="https://raw.githubusercontent.com/unswdb/kuzu-wasm/main/misc/logo.png" height="100">
  <h1>Kùzu-Wasm</h1>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/@kuzu/kuzu-wasm/v/latest">
    <img src="https://img.shields.io/npm/v/@kuzu/kuzu-wasm?logo=npm" alt="kuzu-wasm package on NPM">
  </a>
  <a href="https://github.com/unswdb/kuzu-wasm/actions">
    <img src="https://github.com/unswdb/kuzu-wasm/actions/workflows/shell.yml/badge.svg?branch=main" alt="Github Actions Badge">
  </a>
    <a href="https://hub.docker.com/r/dylanshang/kuzu-wasm">
    <img src="https://img.shields.io/docker/image-size/dylanshang/kuzu-wasm?logo=Docker" alt="Docker Badge">
  </a>

</div>
<h1></h1>

[Kùzu](https://github.com/kuzudb/kuzu) is an embedded graph database built for query speed and scalability.

Kùzu-Wasm brings kuzu to every browser thanks to WebAssembly.


Try it out at [kuzu-shell.netlify.app](https://kuzu-shell.netlify.app).


## Installation
Prerequisite: [Enable Cross-Origin-isolation](https://web.dev/articles/cross-origin-isolation-guide?hl=en#enable_cross-origin_isolation)
### CDN
```javascript
<script type="module">
import kuzu_wasm from 'https://unpkg.com/@kuzu/kuzu-wasm@latest/dist/kuzu-browser.js';
(async () => {
    const kuzu = await kuzu_wasm();
    window.kuzu = kuzu
    const db = await kuzu.Database()
    const conn = await kuzu.Connection(db)
    await conn.execute(`CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))`)
    await conn.execute(`CREATE (u:User {name: 'Alice', age: 35});`)
    const res = await conn.execute(`MATCH (a:User) RETURN a.*;`)
    const res_json = JSON.parse(res.table.toString());
})();
</script>
```
### Webpack/React/Vue
```bash
npm install @kuzu/kuzu-wasm
```
```javascript
import kuzu_wasm from '@kuzu/kuzu-wasm';
(async () => {
    const kuzu = await kuzu_wasm();
    const db = await kuzu.Database()
    const conn = await kuzu.Connection(db)
    await conn.execute(`CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))`)
    await conn.execute(`CREATE (u:User {name: 'Alice', age: 35});`)
    const res = await conn.execute(`MATCH (a:User) RETURN a.*;`)
    const res_json = JSON.parse(res.table.toString());
})();
```

## Build from source
```shell
git clone https://github.com/unswdb/kuzu-wasm.git --recursive
make package
```

## Repository Structure

| Subproject                                               | Description    | Language   |
| -------------------------------------------------------- | :------------- | :--------- |
| [kuzu_wasm](/lib)                                      | Wasm Library   | C++        |
| [@kuzu/kuzu-wasm](/packages/kuzu-wasm)             | Javascript API | Javascript |
| [@kuzu/kuzu-shell](/packages/kuzu-shell) | Cypher Shell      | React       |

## License
By contributing to kuzu-wasm, you agree that your contributions will be licensed under the [MIT License](LICENSE.txt).