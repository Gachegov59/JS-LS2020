function calculator(number = 0, ...args) {

    if (typeof number !== 'number') {
        throw new Error('number is not a number')
    }

    let obj = {}

    try {
        obj = {

            sum(...args) {
                return args.reduce((all, cur) => all += cur, number)
            },

            dif(...args) {
                return args.reduce((all, cur) => all -= cur, number)
            },

            div(...args) {

                // for (let i = 0; i < args.length; i++) {
                //     if (args[i] === 0) {
                //         throw new Error('division by 0')
                //     }
                // }

                args.forEach((item, i) => {
                    if (item[i] === 0) {
                        throw new Error('division by 0')
                    }
                })

                return args.reduce((all, cur) => all /= cur, number)
            },

            mul(...args) {
                return args.reduce((all, cur) => all *= cur, number)
            }
        }

    } catch (e) {
        console.log(e.message)
    }

    return obj
}

let myCalculator = calculator(100)

console.log(myCalculator.sum(1, 2, 5, 6));
console.log(myCalculator.dif(1, 2, 5, 6));
console.log(myCalculator.div(1, 2, 5, 6));
console.log(myCalculator.mul(1, 2, 5, 6));
