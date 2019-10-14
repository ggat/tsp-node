function prims(weights) {
    const
        mst = [],
        poll = [],
        visited = [],
        degrees = {};
    let vertex = 0;

    while (visited.length < weights.length - 1) {

        visited.push(vertex);

        for (let i = 0; i < weights.length; i++) {
            // push edge alongside weight
            weights[vertex][i] !== 0 && poll.push([vertex, i, weights[vertex][i]]);
        }

        let minWeight = Infinity, bestEdgeIndex;
        for (let i = 0; i < poll.length; i++) {
            if (visited.indexOf(poll[i][1]) === -1 && poll[i][2] < minWeight) {
                minWeight = poll[i][2];
                bestEdgeIndex = i;
                vertex = poll[i][1];
            }
        }

        const bestEdge = poll.splice(bestEdgeIndex, 1)[0];

        degrees[bestEdge[1]] = (degrees[bestEdge[1]] || 0) + 1;
        degrees[bestEdge[0]] = (degrees[bestEdge[0]] || 0) + 1;
        mst.push(bestEdge);
    }

    const odds = [];

    for (let key of Object.keys(degrees)) {
        if (degrees[key] % 2) {
            odds.push(parseInt(key));
        }
    }

    return [mst, odds];
}

module.exports = prims;