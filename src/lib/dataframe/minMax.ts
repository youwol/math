import { array, ASerie } from '@youwol/dataframe'

/**
 * Get the min and max of a Serie.
 * The returned array is [min1, min2..., max1, max2...], where 1, 2...
 * is the itemSize.
 * @category Dataframe
 */
 export const minMax = (s: ASerie): number[] => {
    if (s===undefined) throw new Error ('series is undefined')
    
    if (s.itemSize ===1) {
        return array.minMax(s.array)
    }

    const m = new Array(s.itemSize).fill(Number.POSITIVE_INFINITY)
    const M = new Array(s.itemSize).fill(Number.NEGATIVE_INFINITY)
    s.forEach( item => {
        item.forEach( (v,i) => {
            if (v < m[i]) m[i] = v
            if (v > M[i]) M[i] = v
        })
    })
    return [...m, ...M]
}
