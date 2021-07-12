import { array, reduce, Serie } from '@youwol/dataframe'

/**
 * Check if two series are closely equals (at epsilon)
 * @category Dataframe
 */
 export const closeTo = (s1: Serie, s2: Serie, eps: number = 1e-7): boolean => {
    if (s1===undefined) throw new Error ('serie s1 is undefined')
    if (s2===undefined) throw new Error ('serie s2 is undefined')
    
    if (s1.itemSize !== s2.itemSize) return false
    if (s1.count !== s2.count) return false
    const reduced = reduce( [s1,s2], ([x,y]) => Math.abs(x-y)<eps )
    return reduced.array.reduce( (acc, val) => acc&&val, true )
}
