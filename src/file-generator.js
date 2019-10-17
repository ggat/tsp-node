const fs = require('fs');
const filename = 'sample.points';

fs.writeFileSync(filename, '');
for (let i = 0; i < 200; i++) {
// for (let i = 0; i < 20; i++) {
    const [x, y] = [Math.random() * 15, Math.random() * 15];
    fs.appendFileSync(filename, `${x},${y}\n`);
}