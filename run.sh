#!/bin/bash
if [ ! -f "build/index.html" ] || [ ! -f "build/http_server.py" ]; then
    cp TestKit/index.html build/
    cp TestKit/http_server.py build/
    echo "Copied index.html and http_server.py from TestKit to build directory."
fi

cd build && python3 http_server.py