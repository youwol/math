import { Serie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
 export const square = (s: Serie) => {
    if (s===undefined) {throw new Error ('series is undefined')}
    
    return Serie.create({
        array: s.array.map( v => v**2 ),
        itemSize: s.itemSize,
        dimension: s.dimension
    })
}
