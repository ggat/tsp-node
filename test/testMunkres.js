const expect = require('chai').expect;
const munkres = require('../src/munkres');

describe('Munkres', function () {

    const adjMatrix = [
        [10, 5, 13, 15, 16],
        [3, 9, 18, 13, 6],
        [10, 7, 2, 2, 2],
        [7, 11, 9, 7, 12],
        [7, 9, 10, 4, 12],
    ];

    const indexes = munkres(adjMatrix);

    it('should return correct number of matches', function () {
        expect(indexes.length).to.equal(adjMatrix.length);
    });

    it('should return best matching indexes from passed adjMatrix', function () {
        expect(indexes).to.eql([[0,1], [1,0], [2,4], [3,2], [4,3]]);
    });
});