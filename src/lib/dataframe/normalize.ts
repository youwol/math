import { array, Serie } from '@youwol/dataframe'

/**
 * If itemSize is > 1, normalize each item independently, otherwize
 * normalize the serie (since itemSize=1).
 * @category Dataframe
 */
 export const normalize = (s: Serie): Serie => {
    if (s===undefined) {throw new Error ('series is undefined')}
    
    if (s.itemSize ===1) {
        const mM = array.minMax(s.array)
        const m = mM[0]
        const l = 1/(mM[1]-m)
        return s.map( v => l*(v-m) )
    }

    return s.map( item => {
        const l = 1 / Math.sqrt( item.reduce( (acc,v) => acc+v*v, 0 ) )
        //console.log(l)
        return item.map( v => v*l )
    })
}
