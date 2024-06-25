import esbuild from 'esbuild';

// Read CLI flags
let is_debug = false;
let args = process.argv.slice(2);
if (args.length == 0) {
    console.warn('Usage: node bundle.mjs {debug/release}');
} else {
    if (args[0] == 'debug') is_debug = true;
}

(async () => {
    // Bundle the wasm module
    await esbuild.build({
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/kuzu.js',
        platform: 'browser',
        format: 'esm',
        sourcemap: true,
        minify: !is_debug,
        sourcemap: is_debug ? 'inline' : true,
        plugins: []
    });
    console.log('[ ESBUILD ] successfully bundled.');
})();