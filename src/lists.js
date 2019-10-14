function pairs(exclude, arr) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (exclude.indexOf(arr[i]) === -1) {
            result.push([...exclude, arr[i]]);
        }
    }

    return result;
}

function product(arr, length = 1) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        let excludes = [[arr[i]]];
        while (excludes[0].length < length && excludes[0].length < arr.length) {
            let tmp = [];
            for (let j = 0; j < excludes.length; j++) {
                tmp = [...tmp, ...pairs(excludes[j], arr)];
            }
            excludes = tmp;
        }
        result = [...result, ...excludes];
    }

    return result;
}

//todo improve reduce part
function combinations(arr, l) {

    const stack = [];
    const result = [];

    function recurse(of, startFrom, arr) {
        const left = arr.slice(startFrom, arr.length);

        if (of.length === l) {
            result.push(of);
        }

        for (let i = 0; i < left.length; i++) {
            stack.push([[...of, left[i]], startFrom + i + 1, arr]);
        }
    }

    arr.forEach((itm, i) => recurse([itm], i + 1, arr));

    while(stack.length) {
        recurse.apply(null, stack.pop());
    }

    return result;
}

module.exports = {
    combinations
};