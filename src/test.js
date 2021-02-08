debugger
function slice(array, from, to = array.length) {
    let arr = []

    for (let i = from; i < to; i++) {
        arr.push(array[i])

    }


    return arr
}

let arr = [2, 6, 1, 0]
console.log(slice(arr, 1 ));

