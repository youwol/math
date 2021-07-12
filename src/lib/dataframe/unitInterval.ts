import { array, Serie } from '@youwol/dataframe'

/**
 * Transform each item of a serie into a unit interval and independently of each other.
 * For example, item [1,2,5], will be mapped into [0, 0.25, 1].
 * Otherwise, perform the transformation on the serie (e.g., for itemSize=1).
 * @category Dataframe
 */
 export const unitInterval = (s: Serie): Serie => {
    if (s===undefined) throw new Error ('series is undefined')
    
    if (s.itemSize ===1) {
        const mM = array.minMax(s.array)
        const m = mM[0]
        const l = 1/(mM[1]-m)
        return s.map( v => l*(v-m) )
    }

    return s.map( item => {
        const mM = array.minMax(item)
        const m = mM[0]
        const l = 1/(mM[1]-m)
        return item.map( v => l*(v-m) )
    })
}
