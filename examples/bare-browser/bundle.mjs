import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const KUZU_DIST = path.dirname(require.resolve('@kuzu/kuzu-wasm'));

function printErr(err) {
    if (err) return console.log(err);
}
fs.cp(path.resolve(KUZU_DIST), './dist', { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });