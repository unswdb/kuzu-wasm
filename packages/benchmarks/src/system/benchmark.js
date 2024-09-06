const { performance } = require('perf_hooks');

class Benchmark {
    constructor(info) {
        this.info = info;
        this.benchs = [];
    }

    add(name, fn) {
        this.benchs.push({ name, fn, time: [] });
        return this;
    }

    async run() {
        for (let [index, bench] of this.benchs.entries()) {
            for (let i = 0; i < 5; i++) {
                if (i > 1) { // Ignore the first two runs for warm-up
                    const start = performance.now();
                    await bench.fn(); // Await the asynchronous function
                    const end = performance.now();
                    this.benchs[index].time.push(end - start);
                } else {
                    // Warm-up run
                    await bench.fn();
                }
            }
        }
        return this;
    }
}

module.exports = Benchmark;

//test code
// const a = new Benchmark({"name":"testname"})
// a.add("kuzu",async function(){
//     let sum=0
//     for(i=0;i<1000;i++){
//         sum += i
//     }
// }).add("test",async function(){
//     let sum=0
//     for(i=0;i<100;i++){
//         sum += i
//     }
// }).run()
// console.log(a.benchs)