import { array, Serie } from '@youwol/dataframe'

/**
 * Get the min and max of a Serie.
 * The returned array is [min1, min2..., max1, max2...], where 1, 2...
 * is the itemSize.
 * @category Dataframe
 */
export const minMax = (s: Serie): number[] => {
    if (s === undefined) {
        throw new Error('series is undefined')
    }

    if (s.itemSize === 1) {
        return array.minMax(s.array)
    }

    const m = new Array(s.itemSize).fill(Number.POSITIVE_INFINITY)
    const M = new Array(s.itemSize).fill(Number.NEGATIVE_INFINITY)
    s.forEach((item) => {
        item.forEach((v, i) => {
            if (v < m[i]) {
                m[i] = v
            }
            if (v > M[i]) {
                M[i] = v
            }
        })
    })
    return [...m, ...M]
}

/**
 * Get the min of a Serie.
 * The returned type is the min or an array of mins (if itemSize>1)
 * @category Dataframe
 */
export const min = (s: Serie): number | number[] => {
    if (s === undefined) {
        throw new Error('series is undefined')
    }

    if (s.itemSize === 1) {
        return array.min(s.array)
    }

    const m = new Array(s.itemSize).fill(Number.POSITIVE_INFINITY)
    s.forEach((item) => {
        item.forEach((v, i) => {
            if (v < m[i]) {
                m[i] = v
            }
        })
    })
    return m
}

/**
 * Get the max of a Serie.
 * The returned type is the max or an array of maxs (if itemSize>1)
 * @category Dataframe
 */
export const max = (s: Serie): number | number[] => {
    if (s === undefined) {
        throw new Error('series is undefined')
    }

    if (s.itemSize === 1) {
        return array.max(s.array)
    }

    const m = new Array(s.itemSize).fill(Number.POSITIVE_INFINITY)
    s.forEach((item) => {
        item.forEach((v, i) => {
            if (v > m[i]) {
                m[i] = v
            }
        })
    })
    return m
}
