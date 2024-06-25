#!/bin/bash

if [ ! -e "build/dev/" ];then
    echo "Please run build_wasm.sh first."
    exit 1
fi

if [ ! -f "build/dev/index.html" ] || [ ! -f "build/dev/http_server.py" ]; then
    cp test/index.html build/dev/
    cp test/http_server.py build/dev/
    echo "Copied index.html and http_server.py from test to build directory."
fi

cd build/dev && python3 http_server.py