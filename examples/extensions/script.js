const df   = require('../../../dataframe/dist/@youwol/dataframe')
const math = require('../../dist/@youwol/math')

const serie = df.Serie.create({array: [1,2,3, 4,5,6], itemSize: 3})

console.log( math.dot(serie, serie) ) // ===> [14, 77]

// Doesn't work yet in JS (but ok in TypeScript)
console.log( serie.dot(serie) )
