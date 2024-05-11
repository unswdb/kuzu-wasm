# kuzu-wasm

Make sure you have installed:
1. Python3
2. [Emscripten](https://emscripten.org/docs/getting_started/downloads.html)

## Download kuzu
So far, `v0.4.0` is the latest release version of kuzu. 
For development consistency, I recommend that everyone use the same version
```
cd kuzu-wasm
curl -LJO https://github.com/kuzudb/kuzu/archive/refs/tags/v0.4.0.zip
unzip -q kuzu-0.4.0.zip && rm kuzu-0.4.0.zip
mv kuzu-0.4.0 kuzu
```

## Build command
```
chmod 755 build.sh
./build.sh
```
## Run command
```
chmod 755 run.sh
./run.sh
```
## Simple test 
```
var database = new Module.WebDatabase("test",0,4,false,false,4194304*16)
var connection = new Module.WebConnection(database,0)
var r = connection.query("CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))")
r.toString()
r.isSuccess()
var r2 = connection.query('COPY User From "kuzu/dataset/demo-db/csv/user.csv"')
```

## Debug
I debug using Chrome DevTools as described in this [blog post](https://developer.chrome.com/blog/wasm-debugging-2020/), which takes a few steps to set up. The first is to install the [C/C++ DevTools Support Extension](https://chrome.google.com/webstore/detail/cc%20%20-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb) and to enable **WebAssembly Debugging: Enable DWARF support** in the DevTools settings.