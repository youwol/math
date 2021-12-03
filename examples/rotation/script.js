const math = require('../../dist/@youwol/math')
const df   = require('../../../dataframe/dist/@youwol/dataframe')

const s   = 0.707
const rot = math.getRotationAxis('z', 45)
console.log(rot)

const M = df.Serie.create( {array: [9, 8, 7, 6, 5, 4], itemSize: 6})
console.log(M.array)
console.log( math.mat.unpack(M.array) )

const R = math.rotate(M, rot)
console.log(R)


/*
    15.4953   -1.4995    8.4840
   -1.4995   -0.4998   -1.4140
    8.4840   -1.4140    4.0000

or

    -0.4998    1.4995    1.4140
    1.4995   15.4953    8.4840
    1.4140    8.4840    4.0000
*/