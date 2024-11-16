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
        ${ADDITIONAL_FLAGS} -DWASM_WEB=1 -DBUILD_WASM=TRUE -DBUILD_BENCHMARK=FALSE -DBUILD_SHELL=FALSE &&
    emmake make \
        -C build/${MODE} \
        EMCC_CFLAGS="-Wno-c++11-narrowing"\
        -j${CORES} &&
    #rename the output file
    mv build/${MODE}/kuzu-wasm.js build/${MODE}/kuzu-wasm.esm.js &&
    sed -i.bak 's/kuzu-wasm\.js/kuzu-wasm\.esm\.js/g' build/${MODE}/kuzu-wasm.esm.js &&
    # fix problem in https://github.com/emscripten-core/emscripten/issues/22654
    sed -i.bak 's|worker=new Worker(new URL("kuzu-wasm\.esm\.js",import.meta\.url),workerOptions);PThread\.unusedWorkers\.push(worker)|try { var xhr = new XMLHttpRequest(); xhr.open("GET", new URL('\''kuzu-wasm.esm.js'\'', import.meta.url), false); xhr.send(null); if (xhr.status === 200) { const scriptText = xhr.responseText; const workerUrl = URL.createObjectURL(new Blob([scriptText], { type: '\''application/javascript'\'' })); PThread.unusedWorkers.push(new Worker(workerUrl, workerOptions)); } } catch (error) { console.error("Error allocating worker:", error); }|' build/${MODE}/kuzu-wasm.esm.js &&
    rm "build/${MODE}/kuzu-wasm.esm.js.bak" &&
    #build for node
    emcmake cmake \
        -B build/${MODE} \
        ${ADDITIONAL_FLAGS} -DWASM_WEB=0 -DBUILD_WASM=TRUE -DBUILD_BENCHMARK=FALSE -DBUILD_SHELL=FALSE &&
    emmake make \
        -C build/${MODE} \
        EMCC_CFLAGS="-Wno-c++11-narrowing"\
        -j${CORES}
else
    #build for native
	cd kuzu && \
    cmake -B build/release  -DCMAKE_BUILD_TYPE=Release  . \
	cmake --build build/release --config Release
fi
