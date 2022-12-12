import { Serie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const norm = (s: Serie) => {
    return norm2(s).map((v) => Math.sqrt(v))
}

/**
 * @category Dataframe
 */
export const norm2 = (s: Serie) => {
    if (s === undefined) {
        throw new Error('series is undefined')
    }

    const r = s.image(s.count, 1)

    if (s.itemSize === 1) {
        return r
    }

    for (let i = 0; i < s.count; ++i) {
        const v = s.itemAt(i) as number[]
        r.array[i] = v.reduce((acc, v) => acc + v ** 2, 0)
    }

    return r
}
