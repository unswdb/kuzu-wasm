const os = require('os');
const { version: nodeVersion, arch, platform } = process;

// get os info
const osType = os.type();
const osRelease = os.release();
const osPlatform = os.platform();
const osArchitecture = os.arch();

// get v8 version
const v8Version = process.versions.v8;

// get cpu info
const cpuModel = os.cpus()[0].model;
const cpuCores = os.cpus().length;

// get memory info
const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2); // GB
const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);  // GB

systemInfo = {
  osType,
  osRelease,
  osPlatform,
  osArchitecture,
  v8Version,
  cpuModel,
  cpuCores,
  totalMemory,
  freeMemory
}
module.exports = systemInfo


console.log('Platform info:');
console.log('==============');
console.log(`   Platform: ${osPlatform} ${osRelease}`);
console.log(`   Node.JS: ${nodeVersion}`);
console.log(`   V8: ${v8Version}`);
console.log(`   CPU: ${cpuModel} × ${cpuCores}`);
console.log(`   Memory: ${totalMemory} GB (Total), ${freeMemory} GB (Free)`);
