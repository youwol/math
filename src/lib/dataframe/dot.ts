import { vector, Serie, map } from '@youwol/dataframe'
import { vec } from '../vectors'

/**
 * @category Dataframe
 */
export const dot = (a: Serie, b: Serie | vec.IVector) => {
    if (a === undefined) {
        throw new Error('serie a is undefined')
    }
    if (b === undefined) {
        throw new Error('serie or Vector b is undefined')
    }

    if (Serie.isSerie(b) === true) {
        //if ('array' in b) {
        return map([a, b as Serie], ([v1, v2]) => vector(v1).dot(vector(v2)))
    }
    return map(a, (v1) => vector(v1).dot(vector(b as number[])))
}

// declare module "@youwol/dataframe/src/lib/serie" {
//     export interface Serie {
//         dot(a: Serie | vec.IVector)
//     }
// }
// export {}
// Serie.prototype.dot = function (b: Serie | vec.IVector) { return dot(this, b) }
