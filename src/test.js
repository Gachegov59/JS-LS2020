function slice(array, from, to = array.length) {
    let arr = []

    for (let i = from; i < to; i++) {
        arr.push(array[i])
    }

    return arr
}

let ar = [1, 23, 4]

console.log(slice(ar, 1));