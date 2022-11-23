import { Serie } from '@youwol/dataframe'

/**
 * Inverse of matrix3
 * @category Dataframe
 */
export const inv = (s: Serie, throwOnDegenerate = false): Serie => {
    if (s===undefined) throw new Error ('series is undefined')

    const isize = s.itemSize

    if (s.dimension===2 && (isize === 3 || isize===4)) {
        return s.map( (m, index) => {
            const n = [0,0,0,0]
            if (isize === 4) {
                n[0] = m[0]
                n[1] = m[1]
                n[2] = m[2]
                n[3] = m[3]
            }
            else {
                n[0] = m[0]
                n[1] = m[1]
                n[2] = m[1]
                n[3] = m[2]
            }

            const det = n[0]*n[3] - n[1]*n[2]
            if (det===0) {
                let msg = `matrix at index${index} has a determinant = 0`
                if (throwOnDegenerate === true) {
                    throw new Error(msg)
                } else {
                    console.warn(msg)
                }
                return isize===3 ? [0,0,0] : [0,0,0,0]
            }

            const invdet = 1 / det
            return isize===3 ? [n[3]*invdet, -n[1]*invdet, n[0]*invdet] : [n[3]*invdet, -n[1]*invdet, -n[2]*invdet, n[0]*invdet]
        })
    }
    else if (s.dimension===3 && (isize === 6 || isize===9)) {
        if (isize===9) {
            // https://stackoverflow.com/a/18504573
            return s.map( (m, index) => {
                const det = m[0] * (m[4] * m[8] - m[7] * m[5]) -
                    m[1] * (m[3] * m[8] - m[5] * m[6]) +
                    m[2] * (m[3] * m[7] - m[4] * m[6])
    
                if (det===0) {
                    let msg = `matrix at index${index} has a determinant = 0`
                    if (throwOnDegenerate === true) {
                        throw new Error(msg)
                    } else {
                        console.warn(msg)
                    }
                    return [0,0,0,0,0,0,0,0,0]
                }
                const invdet = 1 / det
                const minv  = []
                minv[0] = (m[4] * m[8] - m[7] * m[5]) * invdet
                minv[1] = (m[2] * m[7] - m[1] * m[8]) * invdet
                minv[2] = (m[1] * m[5] - m[2] * m[4]) * invdet
                minv[3] = (m[5] * m[6] - m[3] * m[8]) * invdet
                minv[4] = (m[0] * m[8] - m[2] * m[6]) * invdet
                minv[5] = (m[3] * m[2] - m[0] * m[5]) * invdet
                minv[6] = (m[3] * m[7] - m[6] * m[4]) * invdet
                minv[7] = (m[6] * m[1] - m[0] * m[7]) * invdet
                minv[8] = (m[0] * m[4] - m[3] * m[1]) * invdet
                return minv
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
                    return [0,0,0,0,0,0]
                }
        
                let detInv = 1 / det
                return [t11 * detInv, t12 * detInv, t13 * detInv,
                                   (n33 * n11 - n31 * n13) * detInv, (n31 * n12 - n32 * n11) * detInv,
                                                                     (n22 * n11 - n21 * n12) * detInv]
            })
        }
    }
    else {
        throw new Error(`Series does not have itemSize = 3, 4, 6 or 9 ([xx,xy,yy], [xx,xy,xz,yy,yz,zz], [xx, xy, yx, yy] or [xx,xy,xz,yx,yy,yz,zx,zy,zz]). Got ${isize}`)
    }
}
