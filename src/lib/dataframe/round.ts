import { Serie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const round = (a: Serie) => {
    if (a.itemSize === 1) {
        return a.map( v => Math.round(v) )
    }
    return a.map( v => v.map( w => Math.round(w) ) )
}
