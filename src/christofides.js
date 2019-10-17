const munkres = require('./munkres');
const list = require('./lists');
const prims = require('./prims');
const fleury = require('./fleury.js');

function createWeightMatrix(graph) {
    const matrix = [];

    for (let i = 0; i < graph.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < graph.length; j++) {
            matrix[i][j] = i === j ? Infinity : distance(graph[i], graph[j]);
        }
    }

    return matrix;
}

function distance(a, b) {
    return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

/**
 * Odd vertices are representing indexes of vertices from original complete vertex set
 *
 * @param oddVertices
 * @param edgeWeights
 * @returns {[]}
 */
function* createBipartiteGraphs(edgeWeights, oddVertices) {

    //todo: we are creating graphs with same combination of vertices but alternating vSet, uSet
    //  because for matching sides does not matter we are doing twice more redundant work.
    const uVertexSets = list.combinations(oddVertices, oddVertices.length / 2);

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

function matching(adjMatrix, oddVertices) {

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

function nonPerfectPerfectMatching(weights, oddVertices) {

    // this is a greedy algorithm no really perfect matching
    const matches = [];

    while(oddVertices.length) {
        const v1 = oddVertices.pop();
        let v2Index,
            closest = Infinity;

        for (let v = 0; v < oddVertices.length; v++) {
            if(weights[v1][oddVertices[v]] < closest) {
                closest = weights[v1][oddVertices[v]];
                v2Index = v;
            }
        }

        matches.push([v1, oddVertices.splice(v2Index, 1)[0]]);
    }

    return matches;
}

function createEulerTour(mst, matches) {
    return fleury([...mst, ...matches]);
}

function createHamiltonianTour(euler) {
    const tour = [];

    for (let v = 0; v < euler.length; v++) {
        if(tour.indexOf(euler[v]) === -1) {
            tour.push(euler[v]);
        }
    }

    return [...tour, euler[0]];
}

function christofides(points) {

    const executionStart = process.hrtime();

    const weights = createWeightMatrix(points);

    // step 1 create mst and get odd vertices
    const [mst, oddVertices] = prims(weights);

    // step 2 get matching
    const matches = nonPerfectPerfectMatching(weights, oddVertices);

    // step 3 euler
    const euler = createEulerTour(mst, matches);

    // step 4 hamiltonian
    const hamiltonian = createHamiltonianTour(euler);

    let distance = 0;
    for (let v = 0; v < hamiltonian.length - 1; v++) {
        distance += weights[hamiltonian[v]][hamiltonian[v+1]];
    }

    const hrtime = process.hrtime(executionStart);
    const executionNanos = hrtime[0] * 1e9 + hrtime[1];
    return [hamiltonian, distance, executionNanos / 1000000];

}

module.exports = christofides;
