const fs = require('fs');
const path = require('path');

function generateBenchmarkReport(benchmarks) {
    // Generate the Markdown content
    let mdContent = `| Query Group | Query Name | Mean Time - Kuzu_WASM (ms) | Mean Time - Kuzu_Node (ms) | Diff (Kuzu_WASM vs Kuzu_Node) |\n`;
    mdContent += `| --- | --- | --- | --- | --- |\n`;

    benchmarks.forEach(bench => {
        const name = bench.info.name;
        const queryGroup = bench.info.queryGroup;

        // Calculate average time
        const meanWasm = bench.benchs[0].time.reduce((a, b) => a + b, 0) / bench.benchs[0].time.length;
        const meanNode = bench.benchs[1].time.reduce((a, b) => a + b, 0) / bench.benchs[1].time.length;
        // const meanNeo4j = bench.benchs[2].time.reduce((a, b) => a + b, 0) / bench.benchs[2].time.length;

        const diffWasmNode = meanWasm - meanNode;
        const diffWasmNodePercent = (diffWasmNode / meanNode * 100).toFixed(2);

        // const diffWasmNeo4j = meanWasm - meanNeo4j;
        // const diffWasmNeo4jPercent = (diffWasmNeo4j / meanNeo4j * 100).toFixed(2);

        // Append the result to the Markdown content
        mdContent += `| ${queryGroup} | ${name} | ${meanWasm.toFixed(2)} | ${meanNode.toFixed(2)} | ${diffWasmNode.toFixed(2)} (${diffWasmNodePercent >= 0 ? '+' : ''}${diffWasmNodePercent}%) |\n`;
    });

    // Write the Markdown content to a file
    const outputPath = path.resolve(__dirname, '..', '..', 'benchmark_report.md');
    fs.writeFileSync(outputPath, mdContent, 'utf8');
    console.log(`Benchmark report generated at: ${outputPath}`);
}

// Example usage:
// generateBenchmarkReport(benchmarks);

module.exports = generateBenchmarkReport;
