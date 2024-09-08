#!/usr/bin/env bash
set -euo pipefail
trap exit SIGINT
set -x
emscripten=true

MODE=${1:-relperf}
case $MODE in
  "dev") ADDITIONAL_FLAGS="-DCMAKE_BUILD_TYPE=Debug -DWASM_FAST_LINKING=1" ;;
  "relsize") ADDITIONAL_FLAGS="-DCMAKE_BUILD_TYPE=Release -DWASM_MIN_SIZE=1" ;;
  "relperf") ADDITIONAL_FLAGS="-DCMAKE_BUILD_TYPE=Release" ;;
   *) ;;
esac

CORES=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || sysctl -n hw.ncpu)

if $emscripten;then
    #build for esm
    emcmake cmake \
        -B build/${MODE} \
        ${ADDITIONAL_FLAGS} -DWASM_WEB=1 &&
    emmake make \
        -C build/${MODE} \
        EMCC_CFLAGS="-Wno-c++11-narrowing"\
        -j${CORES} &&
    #rename the output file
    mv build/${MODE}/kuzu-wasm.js build/${MODE}/kuzu-wasm.esm.js &&
    mv build/${MODE}/kuzu-wasm.worker.mjs build/${MODE}/kuzu-wasm.esm.worker.mjs &&
    sed -i.bak 's/kuzu-wasm\.worker\.mjs/kuzu-wasm\.esm\.worker\.mjs/g' build/${MODE}/kuzu-wasm.esm.js
    sed -i.bak 's/kuzu-wasm\.js/kuzu-wasm\.esm\.js/g' build/${MODE}/kuzu-wasm.esm.worker.mjs
    rm "build/${MODE}/kuzu-wasm.esm.js.bak"
    rm "build/${MODE}/kuzu-wasm.esm.worker.mjs.bak"

    #build for node
    emcmake cmake \
        -B build/${MODE} \
        ${ADDITIONAL_FLAGS} -DWASM_WEB=0 &&
    emmake make \
        -C build/${MODE} \
        EMCC_CFLAGS="-Wno-c++11-narrowing"\
        -j${CORES} 
    # mkdir -p packages/kuzu-wasm/dist
    # cp build/${MODE}/kuzu-wasm.* packages/kuzu-wasm/dist/
else
    #build for native
	cd kuzu && \
    cmake -B build/release  -DCMAKE_BUILD_TYPE=Release  . \
	cmake --build build/release --config Release
fi
