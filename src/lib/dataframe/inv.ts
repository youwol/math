import { Serie } from '@youwol/dataframe'

/**
 * Inverse of matrix3
 * @category Dataframe
 */
export const inv = (s: Serie, throwOnDegenerate = false): Serie => {
    if (s===undefined) throw new Error ('series is undefined')
    if (s.itemSize !== 6 && s.itemSize !== 9) throw new Error ('itemSize must be 6 or 9')

    if (s.itemSize===9) {
        return s.map( (me, index) => {    
            let n11 = me[0], n12 = me[1], n13 = me[2],
                n21 = me[3], n22 = me[4], n23 = me[5],
                n31 = me[6], n32 = me[7], n33 = me[8]
            let t11 = n33 * n22 - n32 * n23,
                t12 = n32 * n13 - n33 * n12,
                t13 = n23 * n12 - n22 * n13,
                det = n11 * t11 + n21 * t12 + n31 * t13

            if (det === 0) {
                let msg = `matrix at index${index} has a determinant = 0`
                if (throwOnDegenerate === true) {
                    throw new Error(msg)
                } else {
                    console.warn(msg)
                }
                return [1,0,0,0,1,0,0,0,1]
            }
    
            let detInv = 1 / det
            return [
                t11 * detInv, (n31 * n23 - n33 * n21) * detInv, (n32 * n21 - n31 * n22) * detInv,
                t12 * detInv, (n33 * n11 - n31 * n13) * detInv, (n31 * n12 - n32 * n11) * detInv,
                t13 * detInv, (n21 * n13 - n23 * n11) * detInv, (n22 * n11 - n21 * n12) * detInv
            ]
        })
    }
    else {
        return s.map( (me, index) => {    
            let n11 = me[0], n12 = me[1], n13 = me[2],
                n21 = n12, n22 = me[3], n23 = me[4],
                n31 = n13, n32 = n23, n33 = me[5]
            let t11 = n33 * n22 - n32 * n23,
                t12 = n32 * n13 - n33 * n12,
                t13 = n23 * n12 - n22 * n13,
                det = n11 * t11 + n21 * t12 + n31 * t13

            if (det === 0) {
                let msg = `matrix at index${index} has a determinant = 0`
                if (throwOnDegenerate === true) {
                    throw new Error(msg)
                } else {
                    console.warn(msg)
                }
                return [1,0,0,1,0,1]
            }
    
            let detInv = 1 / det
            return [t11 * detInv, t12 * detInv, t13 * detInv,
                               (n33 * n11 - n31 * n13) * detInv, (n31 * n12 - n32 * n11) * detInv,
                                                                 (n22 * n11 - n21 * n12) * detInv]
        })
    }
}
