import { Serie } from '@youwol/dataframe'

/**
 * Get the indices of Nan values in a serie. For series with itemSize>1,
 * return the indices of the items
 * @example
 * ```ts
 * const a = createSerie( {data: [1, 2, NaN, 4, NaN, 6], itemSize: 1} )
 * console.log( getNaN(a) )
 * // [ 2, 4 ]
 * ```
 * @category Dataframe
 */
export const getNaN = (a: Serie) => {
    const r: Array<number> = []

    if (a.itemSize === 1) {
        a.forEach( (item, i) => {
            if (Number.isNaN(item)) {r.push(i)}
        })
    }
    else {
        const n = a.itemSize
        a.forEach( (item, i) => {
            for (let j=0; j<n; ++j) {
                if (Number.isNaN(item[j])) {
                    r.push(i)
                    break
                }
            }
        })
    }

    return r
}
