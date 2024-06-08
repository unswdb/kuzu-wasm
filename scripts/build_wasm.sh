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
    emcmake cmake \
        -B build/${MODE} \
        ${ADDITIONAL_FLAGS} &&
    emmake make \
        -C build/${MODE} \
        EMCC_CFLAGS="-Wno-c++11-narrowing"\
        -j${CORES} 
else
	cd kuzu && \
    cmake -B build/release  -DCMAKE_BUILD_TYPE=Release  . \
	cmake --build build/release --config Release
fi
