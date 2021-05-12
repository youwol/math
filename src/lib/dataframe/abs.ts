import { ASerie, createSerie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const abs = (s: ASerie): ASerie => {
    if (s===undefined) throw new Error ('series is undefined')
    
    return createSerie({
        data: s.array.map( v => Math.abs(v) ),
        itemSize: s.itemSize
    })
}
