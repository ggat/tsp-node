const fs = require('fs');
const readline = require('readline');
const christofides = require('./christofides');

const [
    inputFile='input.txt',
    outputFile='output.json'
] = process.argv.slice(2);

async function readPointsFile(file) {
    const points = [];
    return new Promise((resolve, reject) => {
        readline.createInterface({
            input: fs.createReadStream(file).on('error', error => {
                reject(error)
            })
        }).on('line', line => {
            const point = line.split(',');
            if (point.length === 2) {
                points.push([parseFloat(point[0]), parseFloat(point[1])]);
            }
        }).on('close', () => resolve(points));
    });
}

readPointsFile(inputFile).then(points => {
    console.info("Start computation...");

    const [tour, distance, executionNanos] = christofides(points);

    const result = JSON.stringify({
        shortest_path_description: tour,
        shortest_path_size: distance,
        time_of_execution: (executionNanos / 1000000000) + ' seconds',
    }, null, 4);

    fs.writeFileSync(outputFile, result);

}).catch(e => console.log('Error while reading input file', e));