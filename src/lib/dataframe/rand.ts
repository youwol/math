import { Serie } from '@youwol/dataframe'

/**
 * @example
 * ```ts
 * const a = createSerie( {data: [1, 2, 3, 4, 5, 6]} )
 * console.log( round( rand(a, -10, 20 ) ) )
 * // [ 17, -5, 14, -5, 5, -8 ]
 * ```
 * @category Dataframe
 */
export const rand = (a: Serie, min = 0, max = 1) => {
    const delta = max - min
    if (a.itemSize === 1) {
        return a.map(() => min + delta * Math.random())
    }
    return a.map(() =>
        new Array(a.itemSize).fill(0).map(() => min + delta * Math.random()),
    )
}
