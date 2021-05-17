import { ASerie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const trunc = (a: ASerie) => {
    if (a.itemSize === 1) {
        return a.map( v => Math.trunc(v) )
    }
    return a.map( v => v.map( w => Math.trunc(w) ) )
}