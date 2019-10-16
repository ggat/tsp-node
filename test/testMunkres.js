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

    const adjMatrix2 = [ [ 9.208483071486267,
        2.271955797010837,
        7.156965046611001,
        6.0209543638386664,
        8.371170769354398,
        6.415055263348892 ],
        [ 14.499412848354138,
            5.112920984317067,
            12.329147919788694,
            10.9923230530744,
            13.055868674342117,
            11.72523686482975 ],
        [ 5.858635089756816,
            7.982607600877334,
            1.028661288697812,
            5.783173712757223,
            7.837690858522129,
            4.161691948326662 ],
        [ 11.5737991005056,
            11.429813991086338,
            6.259548769784926,
            11.441018190867783,
            13.651549796841863,
            9.99556868243906 ],
        [ 13.008260052745204,
            4.213044582524419,
            12.95481641161984,
            9.103559960832609,
            10.342918972395942,
            10.620374550970492 ],
        [ 10.051444430984652,
            1.1313694900862081,
            9.680437460318323,
            6.204766575790553,
            7.89794376841382,
            7.506561355690172 ] ];

    let indexes = munkres(adjMatrix);

    it('should return correct number of matches', function () {
        expect(indexes.length).to.equal(adjMatrix.length);
    });

    it('should return best matching indexes from passed adjMatrix', function () {
        expect(indexes).to.eql([[0,1], [1,0], [2,4], [3,2], [4,3]]);
    });

    let indexes2 = munkres(adjMatrix2);
    //
    it('should return correct number of matches', function () {
        expect(indexes2.length).to.equal(adjMatrix2.length);
    });

    it('should return best matching indexes from passed adjMatrix', function () {
        expect(indexes2).to.eql([[0,5], [1,1], [2,0], [3,2], [4,4], [5,3]]);
    });
});