# Building with Docker to Embed Files
When working with Kuzu WASM, you may want to embed specific or static files/databases into the virtual file system (VFS) during the build process. This approach ensures that static data files are included directly within the WebAssembly module, making them available in the root directory of the VFS at runtime.

## Embedding Files Using Docker
To embed files during the build, place the files you want to include in a directory like /input. The contents of this directory will be packaged into the WASM module and accessible at runtime. The following Docker command allows you to build a Kuzu WASM module with embedded files, with the final output saved to /output:
```bash
docker run --rm \
  -v /output:/kuzu-wasm/packages/kuzu-wasm/dist \
  -v /input:/kuzu-wasm/data/embeddings \
  dylanshang/kuzu-wasm \
  /bin/bash -c "make package"
```

## Limitations:
While embedding files at build time offers simplicity for static data, it has certain limitations:
- Inflexibility: Completed at the compile stage and suitable for static data scenarios
- Larger Build Size: Not suitable for large file, which will significantly increase the size of the WASM file
