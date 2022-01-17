import { Serie, IArray } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const abs = (s: Serie): Serie => {
    if (s===undefined) throw new Error ('series is undefined')
    
    return Serie.create({
        array: s.array.map( v => Math.abs(v) ),
        itemSize: s.itemSize
    })
}
