const   PRISTINE = 0,
        MARKED = 1,
        CANCELED = 2;

function Munkres(adjMatrix) {
    this.adjMatrix = adjMatrix.map(itm => [...itm]);
    this.n = this.adjMatrix.length;
    this.resetMarkTable();
}

Munkres.prototype.findSmallestValue = function() {
    let smallestEntry = Infinity;
    for (let r = 0; r < this.adjMatrix.length; r++) {
        for (let c = 0; c < this.adjMatrix[r].length; c++) {

            if (this.coveredRows.indexOf(r) === -1 && this.coveredCols.indexOf(c) === -1) {
                if (this.adjMatrix[r][c] < smallestEntry) {
                    smallestEntry = this.adjMatrix[r][c];
                }
            }
        }
    }

    return smallestEntry;
};

Munkres.prototype.lines = function() {

    // find a row without assignment and get zero indexes - cols from it
    let
        pickedRows =[],
        pickedCols = [];

    let rowWithoutAssignment = null;
    for (let r = 0; r < this.n; r++) {
        let assignment = false;
        for (let c = 0; c < this.n; c++) {
            if(this.markedTable[r][c] === MARKED) {
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
    for (let c = 0; c < this.n; c++) {
        if(this.adjMatrix[rowWithoutAssignment][c] === 0) {
            pickedCols.push(c);
        }
    }

    // find out zeros with assignment in picked columns and mark rows with this zeros
    for (let r = 0; r < this.n; r++) {
        for (let c = 0; c < pickedCols.length; c++) {
            if(this.markedTable[r][pickedCols[c]] === MARKED) {
                pickedRows.push(r);
            }
        }
    }

    // cover unmarked rows
    const tmp = [];
    for (let r = 0; r < this.n; r++) {
        if(pickedRows.indexOf(r) === -1) {
            tmp.push(r);
        }
    }
    pickedRows = tmp;

    this.coveredRows = pickedRows;
    this.coveredCols = pickedCols;
};

Munkres.prototype.addZeros = function () {
    this.lines();
    const smallestValue = this.findSmallestValue();

    const uncoveredRows = [];

    for (let r = 0; r < this.n; r ++) {
        if(this.coveredRows.indexOf(r) === -1) {
            uncoveredRows.push(r);
        }
    }

    // subtract smallest value from all uncovered rows
    for (let r = 0; r < uncoveredRows.length; r++) {
        for (let c = 0; c < this.n; c ++) {
            this.adjMatrix[uncoveredRows[r]][c] -= smallestValue;
        }
    }

    // add to each covered column
    for (let c = 0; c < this.coveredCols.length; c++) {
        for (let r = 0; r < this.n; r++) {
            this.adjMatrix[r][this.coveredCols[c]] += smallestValue;
        }
    }
};

Munkres.prototype.resetMarkTable = function () {
    this.markedTable = [];

    for (let r = 0; r < this.n; r++) {
        this.markedTable[r] = [];
        for (let c = 0; c < this.n; c++) {
            this.markedTable[r][c] = PRISTINE;
        }
    }
};

Munkres.prototype.alternateToFindAssignments = function () {

    let assignmentCount = 0;

    // todo: reduce duplication in this loop
    while(true) {
        let tmpMarkTable = this.markedTable.map(row => [...row]);
        // mark rows
        for (let r = 0; r < this.n; r++) {
            let zeroCount = 0, zeroIndex = -1;

            // check if has pristine zeros
            for (let c = 0; c < this.n; c++) {
                if(this.adjMatrix[r][c] === 0 && this.markedTable[r][c] === PRISTINE) {
                    zeroCount++;
                    zeroIndex = c;
                }
            }

            // has single zero and it was not canceled of assigned in this iteration
            if(zeroCount === 1 && tmpMarkTable[r][zeroIndex] === PRISTINE) {

                // Increase assignment count
                assignmentCount++;

                // cancel all other zeros in same col
                for (let r = 0; r < this.n; r++) {
                    if(this.adjMatrix[r][zeroIndex] === 0) {
                        tmpMarkTable[r][zeroIndex] = CANCELED
                    }
                }

                // mark this the zero we found in this row
                tmpMarkTable[r][zeroIndex] = MARKED;
            }
        }

        // mark cols
        for (let c = 0; c < this.n; c++) {
            let zeroCount = 0, zeroIndex = -1;

            for (let r = 0; r < this.n; r++) {

                if(this.adjMatrix[r][c] === 0 && this.markedTable[r][c] === PRISTINE) {
                    zeroCount++;
                    zeroIndex = r;
                }
            }

            // has single zero and it was not canceled in this iteration
            if(zeroCount === 1  && tmpMarkTable[zeroIndex][c] === PRISTINE) {

                // Increase assignment count
                assignmentCount++;

                // cancel all other zeros in same row
                for (let c = 0; c < this.n; c++) {
                    if(this.adjMatrix[zeroIndex][c] === 0) {
                        tmpMarkTable[zeroIndex][c] = CANCELED;
                    }
                }

                // mark this the zero we found in this col
                tmpMarkTable[zeroIndex][c] = MARKED;
            }
        }

        if(assignmentCount < this.n) {

            // if has open zeroes continue marking assignments with respect to currently marked and canceled zeros
            // otherwise add more zeros and then continue with clean markTable and reset assignment count
            if(this.hasOpenZeros()) {
                this.markedTable = tmpMarkTable;
            } else {
                this.addZeros();
                this.resetMarkTable();
                assignmentCount = 0;
            }
        } else {

            const matches = [];

            for (let r = 0; r < this.n; r++) {
                for (let c = 0; c < this.n; c++) {
                    if(tmpMarkTable[r][c] === MARKED) {
                        matches.push([r,c]);
                    }
                }
            }

            return matches;
        }
    }
};

Munkres.prototype.compute = function() {

    //initial subtraction
    for (let r = 0; r < this.n; r++) {
        const minEntry = Math.min(...this.adjMatrix[r]);
        for (let c = 0; c < this.n; c++) {
            this.adjMatrix[r][c] = this.adjMatrix[r][c] - minEntry;
        }
    }

    for (let c = 0; c < this.n; c++) {
        const minEntry = Math.min(...this.adjMatrix.map(row => row[c]));
        for (let r = 0; r < this.n; r++) {
            this.adjMatrix[r][c] = this.adjMatrix[r][c] - minEntry;
        }
    }

    return this.alternateToFindAssignments();
};

Munkres.prototype.hasOpenZeros = function () {
    for (let r = 0; r < this.n; r++) {
        for (let c = 0; c < this.n; c++) {
            if(this.adjMatrix[r][c] === 0 && this.markedTable[r][c] === PRISTINE) {
                return true;
            }
        }
    }

    return false;
};

function munkres(adjMatrix) {
    return (new Munkres(adjMatrix)).compute();
}

module.exports = munkres;