const munkres = require('./munkres');
const lists = require('./lists');
const prims = require('./prims');
const fleury = require('./fleury.js');

/**
 *
 * Calculate distance between points
 *
 * @param a
 * @param b
 * @returns {number}
 */
function distance(a, b) {
    return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

/**
 *
 * Create weight - distance adjacency matrix from set of points
 *
 * @param points
 * @returns {[]}
 */
function createWeightMatrix(points) {
    const matrix = [];

    for (let i = 0; i < points.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < points.length; j++) {
            matrix[i][j] = i === j ? Infinity : distance(points[i], points[j]);
        }
    }

    return matrix;
}

/**
 * Generator function to create all possible variants of bipartite graph from even length set of vertices
 *
 * @param edgeWeights
 * @param oddVertices
 * @returns {IterableIterator<*[]>}
 */
function* createBipartiteGraphs(edgeWeights, oddVertices) {

    //todo: we are creating graphs with same combination of vertices but alternating vSet, uSet
    //  because for matching sides does not matter we are doing twice more redundant work.
    const uVertexSets = lists.combinations(oddVertices, oddVertices.length / 2);

    // create graphs
    for(const uSet of uVertexSets) {
        const
            vSet = [],
            weightMatrix = [];

        uSet.sort();

        for (let j = 0; j < oddVertices.length; j++) {
            if(uSet.indexOf(oddVertices[j]) === -1) {
                vSet.push(oddVertices[j]);
            }
        }

        // edge weights for odd vertices
        for (let u = 0; u < uSet.length; u++) {
            weightMatrix[u] = [];
            for (let v = 0; v < vSet.length; v++) {
                weightMatrix[u][v] = edgeWeights[uSet[u]][vSet[v]];
            }
        }

        yield [weightMatrix, uSet, vSet];
    }
}

/**
 * TODO: Rewrite to blossom.
 *
 * Find minimum perfect matching. Using bruteforce strategy.
 *
 * @param adjMatrix
 * @param oddVertices
 * @returns {*}
 */
function perfectMatching(adjMatrix, oddVertices) {

    let minWeight = Infinity,
        bestBipartiteGraph,
        matches;

    let graphs = createBipartiteGraphs(adjMatrix, oddVertices);
    for (let graph of graphs) {
        const minimumMatches = munkres(graph[0]);
        const weight = minimumMatches.reduce((sum, match) => sum + graph[0][match[0]][match[1]], 0);

        if(weight < minWeight) {
            minWeight = weight;
            matches = minimumMatches;
            bestBipartiteGraph = graph;
        }
    }

    const [,uSet, vSet] = bestBipartiteGraph;

    return matches.map(([u, v]) => [uSet[u], vSet[v]]);
}

/**
 *
 * Create Euler tour from MST and matched odd vertices.
 *
 * @param mst
 * @param matches
 * @returns {[*]}
 */
function createEulerTour(mst, matches) {
    return fleury([...mst, ...matches]);
}

/**
 *
 * Shortcut euler tour
 *
 * @param euler
 * @returns {*[]}
 */
function createHamiltonianTour(euler) {
    const tour = [];

    for (let v = 0; v < euler.length; v++) {
        if(tour.indexOf(euler[v]) === -1) {
            tour.push(euler[v]);
        }
    }

    return [...tour, euler[0]];
}

/**
 *
 * Christofides algorithm to solve Travelling Salesman Problem.
 *
 * @param points
 * @returns {*[]}
 */
function christofides(points) {

    const weights = createWeightMatrix(points);

    // step 1 create mst and get odd vertices
    const [mst, oddVertices] = prims(weights);

    // step 2 get matching
    const matches = perfectMatching(weights, oddVertices);

    // step 3 euler
    const euler = createEulerTour(mst, matches);

    // step 4 hamiltonian
    const hamiltonian = createHamiltonianTour(euler);

    let distance = 0;
    for (let v = 0; v < hamiltonian.length - 1; v++) {
        distance += weights[hamiltonian[v]][hamiltonian[v+1]];
    }

    return [hamiltonian, distance];
}

module.exports = points => {

    const executionStart = process.hrtime();

    const result = christofides(points);

    const hrtime = process.hrtime(executionStart);
    const executionNanos = hrtime[0] * 1e9 + hrtime[1];

    return [...result, executionNanos];
};
