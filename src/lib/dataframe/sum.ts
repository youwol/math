import { Serie } from '@youwol/dataframe'

/**
 * Perform the sum of items of a Serie
 * @category Dataframe
 */
export const sum = (a: Serie): number | number[] => {
    if (a.itemSize === 1) {
        let r = 0
        a.forEach( v => r += v )
        return r
    }
    const r = new Array(a.itemSize).fill(0)
    a.forEach( item => item.forEach( (v,i) => r[i] += v ) )
    return r
}
