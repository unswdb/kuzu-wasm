const kuzu_node = require("./kuzu_node");
const { conn_wasm_promise } = require("./kuzu_wasm");
const Benchmark = require('./system/benchmark');
const { benchmarkQueries,benchmarkQueries_neo4j } = require('../ldbc-sf01/get_query');
const generateBenchmarkReport = require('./system/generateBenchmarkReport'); // Import the report function
const systeminfo = require('./system/info');
// const neo4j = require("./neo4j");

(async () => {

    // Print system information
    console.log(systeminfo)

    let conn_node, conn_wasm;

    try {
        console.log("Awaiting connections...");
        conn_node = kuzu_node.conn;
        conn_wasm = await conn_wasm_promise;
        console.log("Connections established:");
    } catch (error) {
        console.error('Failed to initialize connections:', error);
        return; // Exit the async function if initialization fails
    }

    // Start benchmark
    console.log(`${'='.repeat(20)}\nstart to run benchmark`);
    var benchmarks = [];

    for (const [index, query] of benchmarkQueries.entries()) {
        var bench = new Benchmark({
            name: query.name,
            queryGroup: query.queryGroup,
            queryText: query.query
        });

        bench.add("kuzu-wasm", async function () {
            await conn_wasm.query(query.query);
        }).add("kuzu-node", async function () {
            await conn_node.query(query.query);
        });
        // .add("Neo4j", async function () {
        //     const query_neo4j = benchmarkQueries_neo4j[index].query
        //     await neo4j.session.run(query_neo4j);
        // });

        await bench.run(); 
        benchmarks.push(bench);
        console.log(bench.benchs); 
    }

    // Generate the benchmark report
    generateBenchmarkReport(benchmarks);

    // Clean up database
    kuzu_node.afterAll();
})();
