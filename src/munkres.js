const   PRISTINE = 0,
        MARKED = 1,
        CANCELED = 2;

function munkres(adjacencyMatrix) {

    //todo: better way to copy this one?

    let src = adjacencyMatrix.map(itm => [...itm]);
    const n = src.length;

    //initial subtraction
    for (let r = 0; r < n; r++) {
        const minEntry = Math.min(...src[r]);
        for (let c = 0; c < n; c++) {
            src[r][c] = src[r][c] - minEntry;
        }
    }

    for (let c = 0; c < n; c++) {
        const minEntry = Math.min(...src.map(row => row[c]));
        for (let r = 0; r < n; r++) {
            src[r][c] = src[r][c] - minEntry;
        }
    }

    return alternateToFindAssignments(src, n);
}

function findSmallestValue(matrix, crossedRows, crossedCols) {
    let smallestEntry = Infinity;
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {

            if (crossedRows.indexOf(r) === -1 && crossedCols.indexOf(c) === -1) {
                if (matrix[r][c] < smallestEntry) {
                    smallestEntry = matrix[r][c];
                }
            }
        }
    }

    return smallestEntry;
}

function alternateToFindAssignments(src, n) {

    let markedTable = [];

    let assignmentCount = 0;

    for (let r = 0; r < n; r++) {
        markedTable[r] = [];
        for (let c = 0; c < n; c++) {
            markedTable[r][c] = PRISTINE;
        }
    }

    while(true) {

        let tmpMarkTable = markedTable.map(row => [...row]);
        // mark rows
        for (let r = 0; r < n; r++) {
            let zeroCount = 0, zeroIndex = -1;

            // check if has pristine zeros
            for (let c = 0; c < n; c++) {
                if(src[r][c] === 0 && markedTable[r][c] === PRISTINE) {
                    zeroCount++;
                    zeroIndex = c;
                }
            }

            // has single zero and it was not canceled of assigned in this iteration
            if(zeroCount === 1 && tmpMarkTable[r][zeroIndex] === PRISTINE) {

                // Increase assignment count
                assignmentCount++;

                // cancel all other zeros in same col
                for (let r = 0; r < n; r++) {
                    if(src[r][zeroIndex] === 0) {
                        tmpMarkTable[r][zeroIndex] = CANCELED
                    }
                }

                // mark this the zero we found in this row
                tmpMarkTable[r][zeroIndex] = MARKED;
            }
        }

        // mark cols
        for (let c = 0; c < n; c++) {
            let zeroCount = 0, zeroIndex = -1;

            for (let r = 0; r < n; r++) {

                if(src[r][c] === 0 && markedTable[r][c] === PRISTINE) {
                    zeroCount++;
                    zeroIndex = r;
                }
            }

            // has single zero and it was not canceled in this iteration
            if(zeroCount === 1  && tmpMarkTable[zeroIndex][c] === PRISTINE) {

                // Increase assignment count
                assignmentCount++;

                // cancel all other zeros in same row
                for (let c = 0; c < n; c++) {
                    if(src[zeroIndex][c] === 0) {
                        tmpMarkTable[zeroIndex][c] = CANCELED;
                    }
                }

                // mark this the zero we found in this col
                tmpMarkTable[zeroIndex][c] = MARKED;
            }
        }

        if(assignmentCount < n) {

            // if has open zeroes continue marking assignments with respect to currently marked and canceled zeros
            // otherwise add more zeros and then continue with clean markTable and reset assignment count
            if(hasOpenZeros(src, tmpMarkTable, n)) {
                console.log('there is no enough assignments and there are some open zeros')
                markedTable = tmpMarkTable;
            } else {
                console.log('no open zeros left and there is no enough assignments. adding more zeros...')
                src = addZeros(src, tmpMarkTable, n);
                assignmentCount = 0;
            }
        } else {

            const matches = [];

            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    if(tmpMarkTable[r][c] === MARKED) {
                        matches.push([r,c]);
                    }
                }
            }

            return matches;
        }
    }
}

function hasOpenZeros(src, markedTable, n) {
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if(src[r][c] === 0 && markedTable[r][c] === PRISTINE) {
                return true;
            }
        }
    }

    return false;
}

function lines(src, markedTable, n) {

    // todo: we are considering that there will be only one row without assignment, check if it's
    //  possible to have more rows without assignment, in that case we have to collect rows instead of picking one.
    // find a row without assignment and get zero indexes - cols from it

    let
        pickedRows =[],
        pickedCols = [];

    let rowWithoutAssignment = null;
    for (let r = 0; r < n; r++) {
        let assignment = false;
        for (let c = 0; c < n; c++) {
            if(markedTable[r][c] === MARKED) {
                assignment = true;
            }
        }

        if(!assignment) {
            rowWithoutAssignment = r;
        }
    }

    // pick a row without assigment
    pickedRows.push(rowWithoutAssignment);

    // find zeros in a row without assignment and pick cols with this zeros
    for (let c = 0; c < n; c++) {
        if(src[rowWithoutAssignment][c] === 0) {
            pickedCols.push(c);
        }
    }

    // find out zeros with assignment in picked columns and mark rows with this zeros
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < pickedCols.length; c++) {
            if(markedTable[r][pickedCols[c]] === MARKED) {
                pickedRows.push(r);
            }
        }
    }

    // cover unmarked rows
    const tmp = [];
    for (let r = 0; r < n; r++) {
        if(pickedRows.indexOf(r) === -1) {
            tmp.push(r);
        }
    }
    pickedRows = tmp;

    return [pickedRows, pickedCols];
}

function addZeros(src, markedTable, n) {

    const [coveredRows, coveredCols] = lines(src, markedTable, n);
    const smallestValue = findSmallestValue(src, coveredRows, coveredCols);
    const result = src.map(row => [...row]);

    const uncoveredRows = [];

    for (let r = 0; r < n; r ++) {
        if(coveredRows.indexOf(r) === -1) {
            uncoveredRows.push(r);
        }
    }

    // subtract smallest value from all uncovered rows
    for (let r = 0; r < uncoveredRows.length; r++) {
        for (let c = 0; c < n; c ++) {
            result[uncoveredRows[r]][c] -= smallestValue;
        }
    }

    // add to each covered column
    for (let c = 0; c < coveredCols.length; c++) {
        for (let r = 0; r < n; r++) {
            result[r][coveredCols[c]] += smallestValue;
        }
    }

    return result;
}

module.exports = munkres;