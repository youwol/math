import { Serie, squaredMatrix, symSquaredMatrix, Vector } from '@youwol/dataframe'
import { mult } from './mult'

// NOTE
// Implicitly, any itemSize=3 is a vector
// If itemSize>3 (6 or 9), it is a matrix

/**
 * Perform either:
 * 1. `Vec*number` (scale)
 * 2. `Vec*Vec` (dot)
 * 3. `Mat*number` (scale)
 * 4. `Mat*Vec`
 * 5. `Mat*Mat`
 * @example
 * Perform A.B.AT
 * ```ts
 * const A = Serie.create({array: new Array(27).fill(2), itemSize: 9})
 * const B = Serie.create({array: new Array(18).fill(3), itemSize: 6})
 * const a = multMat(A, multMat(B, transpose(A)))
 * ```
 * @category Dataframe
 */
export const multMat = (s1: Serie, s2: Serie|number): Serie => {
    if (s1 === undefined) {throw new Error('s1 is undefined')}
    if (s2 === undefined) {throw new Error('s2 is undefined')}

    if (typeof s2 === 'number') {
        const s = s2 
        return mult(s1, s2)  //s1.map( v => v*s)
    }
    if (s2.itemSize===1) {
        return s1.map( (v,i) => v*(s2.itemAt(i) as number))
    }

    if (s1.itemSize === 1) {
        if (s2.itemSize!==1) {throw new Error('s2 should have itemSize=1 (same as s1)')}
        return s1.map( (v,i) => v*(s2.itemAt(i) as number))
    }

    if (s1.itemSize === 3) {
        if (s2.itemSize===3) {
            return s1.map( (v, i) => {
                const w = s2.itemAt(i)
                return v[0]*w[0] + v[1]*w[1] + v[2]*w[2] // dot
            })
        }
        throw new Error('since s1 has itemSize=3, s2 should have itemSize=1 or 3')
    }

    if (s1.itemSize === 6 || s1.itemSize===9) {
        if (s2.itemSize===3) {
            return s1.map( (v, i) => {
                const A = s1.itemSize===6 ? symSquaredMatrix(v) : squaredMatrix(v)
                const b = new Vector(s2.itemAt(i) as number[])
                return A.multVec(b).array
            })
        }
        if (s2.itemSize===6 || s2.itemSize===9) {
            return s1.map( (v, i) => {
                const A = s1.itemSize===6 ? symSquaredMatrix(v) : squaredMatrix(v)
                const b = s2.itemSize===6 ? symSquaredMatrix(s2.itemAt(i) as number[]) : squaredMatrix(s2.itemAt(i) as number[])
                return A.multMat(b).array
            })
        }
    }

    throw new Error('Cannot multMat')
}

/*

1) A non sym
-----------------
A = [1 2 3 4 5 6 7 8 9]

B = [1 2 3]
A*B' = [14 32 50]

B = [9 8 7 6 5 4]
A*B = [46 35 29 118 92 77 190 149 125]

B = [9 8 7 6 5 4 3 2 1]
A*B = [30 24 18 84 69 54 138 114 90]

2) A sym
-----------------
A = [9 8 7 6 5 4]

B = [1 2 3]
A*B' = [46 35 29]

B = [1 2 3 4 5 6]
A*B = [46    85   109   35    65    84   29    54    70]

B = [1 2 3 4 5 6 7 8 9]
A*B = [90   114   138   67    86   105   55    71    87]
*/