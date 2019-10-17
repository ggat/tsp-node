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

    // forces algorithm to draw lines multiple times
    let adjMatrix2 = [ [ 4.930604001982131,
        8.934205030291267,
        6.85654807253695,
        7.7456896168776455,
        2.644995736006861,
        3.4599960859383017 ],
        [ 7.661547426459234,
            9.597989174353915,
            4.164901777139486,
            6.952891162920816,
            1.270065280110543,
            3.0247650277978186 ],
        [ 2.2098139789775977,
            10.422778204330452,
            13.667958232029916,
            12.730615926778725,
            9.298456415795792,
            9.412613539201558 ],
        [ 9.14229924797652,
            12.832474940142284,
            5.78282105245228,
            3.6431436706659324,
            4.563756438396875,
            1.374398101885925 ],
        [ 5.278738558642674,
            12.465663782107496,
            10.150780994065208,
            6.649565769781458,
            6.550222899536557,
            4.1532997694707525 ],
        [ 8.60989002527164,
            13.787821626354459,
            7.907138282522182,
            2.94466981050803,
            5.9339539834921124,
            1.8180725582960289 ] ];

    adjMatrix2 = adjMatrix2.map(row => row.map( cell => Math.round(cell * 100)))

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
        expect(indexes2).to.eql([[0,1], [1,4], [2,0], [3,2], [4,5], [5,3]]);
    });
});