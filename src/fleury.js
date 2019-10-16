module.exports = function fleury(multiGraph) {
    multiGraph = multiGraph.map(edge => [...edge]);

    let currentVertex = multiGraph[0][0],
        tour = [currentVertex];

    while (multiGraph.length) {
        const edges = findVertexEdges(multiGraph, currentVertex);
        for (let e = 0; e < edges.length; e++) {
            const edge = edges[e];
            const count1 = reachableVertexCountOf(multiGraph, currentVertex);
            const testGraph = multiGraph.map(edge => [...edge]);
            removeEdge(testGraph, edge);
            const count2 = reachableVertexCountOf(testGraph, currentVertex);

            if(count1 === count2 || edges.length === 1) {
                // it's not a bridge
                const newVertex = edge[0] !== currentVertex ?  edge[0] : edge[1];
                removeEdge(multiGraph, edge);
                tour.push(newVertex);
                currentVertex = newVertex;
                break;
            }
        }
    }

    return tour;
};

function removeEdge(multiGraph, edge) {

    for (let e = 0; e < multiGraph.length; e++) {
        if(multiGraph[e][0] === edge[0] && multiGraph[e][1] === edge[1]) {
            multiGraph.splice(e, 1);
            break;
        }
    }
}

function findVertexEdges(multigraph, v) {

    const edges = [];

    for (let e = 0; e < multigraph.length; e++) {
        if(multigraph[e][0] === v || multigraph[e][1] === v) {
            edges.push(multigraph[e]);
        }
    }

    return edges;
}

//todo: dont't like how this is written
function reachableVertexCountOf(combinedMst, currentVertex) {

    const visited = [currentVertex];
    function recurse(combinedMst, currentVertex) {
        let count = 1;
        for (let i = 0; i < combinedMst.length; i++) {

            let adjVertex;

            if (combinedMst[i][0] === currentVertex && visited.indexOf(combinedMst[i][1]) === -1) {
                adjVertex = combinedMst[i][1]
            } else if (combinedMst[i][1] === currentVertex && visited.indexOf(combinedMst[i][0]) === -1) {
                adjVertex = combinedMst[i][0];
            }

            if (adjVertex !== undefined) {
                visited.push(adjVertex);
            }
            count += (adjVertex !== undefined ? recurse(combinedMst, adjVertex, visited) : 0);
        }

        return count;
    }

    return  recurse(combinedMst, currentVertex);
}