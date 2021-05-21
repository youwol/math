import { Serie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const mean = (s: Serie): number|number[] => {
    if (s===undefined) throw new Error ('series is undefined')

    const n = s.itemSize
    if (n === 1) {
        return s.array.reduce( (acc, v) => acc+v, 0)/s.length
    }

    const r = new Array(n).fill(0)

    s.forEach( v => {
        for (let j=0; j<n; ++j) {
            r[j] += v[j]/s.count
        }
    })

    return r
}
