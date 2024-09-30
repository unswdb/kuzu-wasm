# Getting Started
## Installation
::: warning [Prerequisite](prerequisite)
Please make sure you have enable [Cross-Origin-Isolation](prerequisite) first.
:::

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
::: code-group

```sh [npm]
$ npm add @kuzu/kuzu-wasm
```

```sh [pnpm]
$ pnpm add @kuzu/kuzu-wasm
```

```sh [yarn]
$ yarn add @kuzu/kuzu-wasm
```

```sh [yarn (pnp)]
$ yarn add @kuzu/kuzu-wasm
```

```sh [bun]
$ bun add @kuzu/kuzu-wasm
```

:::

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

