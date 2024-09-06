<div align="center">
  <img src="https://raw.githubusercontent.com/dylanshang/kuzu-wasm/main/misc/logo.png" height="100">
  <h1>Kùzu-Wasm</h1>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/@kuzu/kuzu-wasm/v/latest">
    <img src="https://img.shields.io/npm/v/@kuzu/kuzu-wasm?logo=npm" alt="kuzu-wasm package on NPM">
  </a>
  <a href="https://github.com/dylanshang/kuzu-wasm/actions">
    <img src="https://github.com/dylanshang/kuzu-wasm/actions/workflows/shell.yml/badge.svg?branch=main" alt="Github Actions Badge">
  </a>
</div>
<h1></h1>

[Kùzu](https://github.com/kuzudb/kuzu) is an embedded graph database built for query speed and scalability.

Kùzu-Wasm brings kuzu to every browser thanks to WebAssembly.


Try it out at [kuzu-shell.netlify.app](https://kuzu-shell.netlify.app).

## Build from source
```shell
git clone https://github.com/DylanShang/kuzu-wasm.git --recursive
make
```

## Repository Structure

| Subproject                                               | Description    | Language   |
| -------------------------------------------------------- | :------------- | :--------- |
| [kuzu_wasm](/lib)                                      | Wasm Library   | C++        |
| [@kuzu/kuzu-wasm](/packages/kuzu-wasm)             | Javascript API | Javascript |
| [@kuzu/kuzu-shell](/packages/kuzu-shell) | Cypher Shell      | React       |

## Debug
I debug using Chrome DevTools as described in this [blog post](https://developer.chrome.com/blog/wasm-debugging-2020/), which takes a few steps to set up. The first is to install the [C/C++ DevTools Support Extension](https://chrome.google.com/webstore/detail/cc%20%20-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb) and to enable **WebAssembly Debugging: Enable DWARF support** in the DevTools settings.