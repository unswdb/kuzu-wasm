import {parseData, parseField, parseRecordBatch, parseSchema, parseTable, parseVector} from './arrow-js-ffi.es.mjs'
import {tableToIPC} from 'apache-arrow'
import * as kuzu from '../dist/kuzu-wasm.esm.js';

var kuzu_wasm = async function initializeKuzu() {
    let module = await kuzu.default();
    module.Database = (...args) => initializeWebDatabase(module, ...args);
    module.Connection = (...args) => initializeWebConnection(module, ...args);
    return module;
}

async function initializeWebDatabase(module, databasePath="memDB", bufferPoolSize=0, maxNumThreads=0, compression=false, readOnly=false, maxDBSize=4194304*16*4) {
    let webDatabaseModule = await new module.WebDatabase(databasePath, bufferPoolSize, maxNumThreads, compression, readOnly, maxDBSize);
    return webDatabaseModule;
}

async function initializeWebConnection(module, WebDatabase,numThreads=0) {
    let webConnectionModule = await new module.WebConnection(WebDatabase, numThreads);
    webConnectionModule.execute = (query_text) => execute(module,webConnectionModule, query_text);
    return webConnectionModule;
}

async function execute(module,webConnectionModule,query_text) {
    let result = webConnectionModule.query(query_text);
    if(result.isSuccess()){
        const schemaPtr = result.getArrowSchema()
        const arrayPtr = result.getArrowChunk()
        const WASM_MEMORY = module.wasmMemory
        let table = parseTable(
            WASM_MEMORY.buffer,
            [arrayPtr],
            schemaPtr,
            true
        );
        table.toIPC=()=>{
            const buffer = tableToIPC(table)
            buffer.toHex = () => {
                const hexArray = [];
                const byteArray = new Uint8Array(buffer);
                byteArray.forEach(byte => {
                    const hex = byte.toString(16).padStart(2, '0');
                    hexArray.push(hex);
                });
                return hexArray.join('');
            }
            return buffer;
        }
        result.table = table;
        return result;
    }
    return false;
}

export default kuzu_wasm;