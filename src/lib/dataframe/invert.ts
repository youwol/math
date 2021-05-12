import { ASerie, createSerie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const invert = (s: ASerie): ASerie => {
    if (s===undefined) throw new Error ('series is undefined')

    return createSerie({
        data: s.array.map( v => 1/v ),
        itemSize: s.itemSize
    })
}
