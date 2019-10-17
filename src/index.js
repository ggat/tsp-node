const fs = require('fs');
const readline = require('readline');
const christofides = require('./christofides');

const points = [];

for (let i = 0; i < 20; i++) {
    points.push([Math.random() * 15, Math.random() * 15])
}

async function readPointsFile(file) {
    const points = [];
    return new Promise((resolve, reject) => {
        readline.createInterface({
            input: fs.createReadStream(file).on('error', error => {
                reject(error)
            })
        }).on('line', line => {
            const point = line.split(',');
            if(point.length === 2) {
                points.push([parseFloat(point[0]), parseFloat(point[1])]);
            }
        }).on('close', () => resolve(points));
    });
}

readPointsFile('sample.points').then(points => {
    console.info("Start computation...");

    const [tour, distance, executionTimeMs] = christofides(points);

    const result =JSON.stringify({
        shortest_path_description: tour,
        shortest_path_size: distance,
        time_of_execution: (executionTimeMs / 1000) + ' seconds',
    }, null, 4);

    fs.writeFileSync('result.json', result);

}).catch(e => console.log('Error while reading input file', e));