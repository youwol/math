import { Serie } from '@youwol/dataframe'
import { add } from "./add"
import { mult } from "./mult"

/**
 * Return a weighted sum of [[Serie]]s
 * @example
 * ```ts
 * // performs: 1*S1 + 2*S2 + 3*S3
 * const S = [
 *     createSerie( {data: createArray(18, i => i  ), itemSize: 6}), // S1
 *     createSerie( {data: createArray(18, i => i+1), itemSize: 6}), // S2
 *     createSerie( {data: createArray(18, i => i+2), itemSize: 6})  // S3
 * ]
 * 
 * const r = weightedSum(S, [1,2,3])
 * console.log(r.array)
 * 
 * // [ 8, 14, 20, 26,  32,  38,
 * //  44, 50, 56, 62,  68,  74,
 * //  80, 86, 92, 98, 104, 110 ]
 * ```
 * @category Dataframe
 */
export const weightedSum = (data: Serie[], alpha: number[]): Serie => {
    if (alpha.length !== data.length) {throw new Error(`data length (${data.length}) should be equal to alpha length (${alpha.length})`)}
    return add( data.map( (d,i) => mult(d, alpha[i])) )
}
