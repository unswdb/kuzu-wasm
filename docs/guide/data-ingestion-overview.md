# Overview

## Virtual File System (VFS)
Kuzu WASM leverages the [Emscripten File System API](https://emscripten.org/docs/api_reference/Filesystem-API.html) to manage file operations within a WebAssembly environment. To import files into Kuzu, the data files must first be placed in the Emscripten file system.

## Import Data
Currently, there are several ways to achieve this:

- [Directly Write to the VFS](writing-to-file)
- [Fetch from the Network (may be affected by CORS policy)](fetch-from-network)
- [Customized Kuzu WASM Built with Docker](build-with-docker)

