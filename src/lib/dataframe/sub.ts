import { Serie } from '@youwol/dataframe'

/**
 * Subtract several Series to generate a new one
 * @example
 * ```ts
 * // perform: a = b - c
 * const a = sub(
 *     df.get('b'),
 *     df.get('c'),
 * )
 * ```
 * @category Dataframe
 */
export const sub = (s: Serie, ...others: (Serie | number)[]) => {
    if (s === undefined) {
        throw new Error('serie s is undefined')
    }
    if (!others) {
        throw new Error('cannot subtract undefined to s')
    }

    const r = s.clone()

    // rest
    if (others) {
        others.forEach((o) => {
            if (typeof o === 'number') {
                r.array.forEach((_, i) => (r.array[i] -= o))
            } else {
                if (o.length !== s.length) {
                    throw new Error(
                        `size mistmatch. Cannot add 2 Series of different sizes (${o.length} != ${s.length})`,
                    )
                }
                o.array.forEach((v, i) => (r.array[i] -= v))
            }
        })
    }

    return r
}
