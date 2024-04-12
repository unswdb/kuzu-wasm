#!/bin/bash
CORES=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || sysctl -n hw.ncpu)
emcmake cmake \
    -B build \
    -DCMAKE_BUILD_TYPE=Debug . &&
emmake make \
    -C build \
    EMCC_CFLAGS="-Wno-c++11-narrowing"\
    -j${CORES} 


