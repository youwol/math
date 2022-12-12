// import { array, reduce, Serie } from '@youwol/dataframe'
import { Serie, reduce } from '@youwol/dataframe'

/**
 * Check if two series are strictly equals
 * @category Dataframe
 */
export const equals = (s1: Serie, s2: Serie): boolean => {
    if (s1 === undefined) {
        throw new Error('serie s1 is undefined')
    }
    if (s2 === undefined) {
        throw new Error('serie s2 is undefined')
    }

    if (s1.itemSize !== s2.itemSize) {
        return false
    }
    if (s1.count !== s2.count) {
        return false
    }

    return reduce([s1, s2], (acc, [x, y]) => acc && x === y, true)

    // Old impl:
    // -----------------
    // const reduced = reduce( [s1,s2], ([x,y]) => x===y, true )
    // return reduced.array.reduce( (acc, val) => acc&&val, true )
}
