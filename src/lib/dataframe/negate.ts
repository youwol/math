import { Serie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const negate = (s: Serie): Serie => {
    if (s === undefined) {
        throw new Error('series is undefined')
    }

    return Serie.create({
        array: s.array.map((v) => -v),
        itemSize: s.itemSize,
        dimension: s.dimension,
    })
}
