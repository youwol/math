import { check, cut, Serie, sort } from '@youwol/dataframe'

/**
 * See https://en.wikipedia.org/wiki/Box_plot
 * @category Dataframe/stats
 */
export const quantile = (s: Serie, q: number): number => {
    if (s===undefined) {throw new Error ('series is undefined')}
    if (s.itemSize !== 1) {throw new Error('quantile algorithm: itemSize must be 1')}
    if (q<0) {throw new Error ('quantile must be >= 0')}
    if (q>1) {throw new Error ('quantile must be <= 1')}

    const newSerie = sort(s)
    const sorted = newSerie.array
    const pos = (sorted.length - 1) * q
    const base = Math.floor(pos)
    const rest = pos - base
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base])
    } else {
        return sorted[base]
    }
}

/**
 * @category Dataframe/stats
 */
export const q25 = (s: Serie): number => quantile(s, 0.25)

/**
 * @category Dataframe/stats
 */
export const q50 = (s: Serie): number => quantile(s, 0.50)

/**
 * @category Dataframe/stats
 */
export const q75 = (s: Serie): number => quantile(s, 0.75)

/**
 * @category Dataframe/stats
 */
export const IQR = (s: Serie): number => quantile(s, 0.75)-quantile(s, 0.25)

/**
 * @category Dataframe/stats
 */
export const outliers = (s: Serie, mustache: number): Serie => {
    const o = __ouliers__(s, mustache)
    return cut(s, v => v<o.min || v>o.max )
}

/**
 * Return a serie of boolean indicating if an item of the serie s is an outliers or not
 * @category Dataframe/stats
 */
 export const isOutliers = (s: Serie, mustache: number): Serie => {
    const o = __ouliers__(s, mustache)
    return check(s, v => v<o.min || v> o.max )
}

/**
 * @see https://en.wikipedia.org/wiki/Interquartile_range
 * @see https://en.wikipedia.org/wiki/Box_plot
 * @param mustache The statistical distance for which a point is considered as outlier. Default 1.5
 * @category Dataframe/stats
 */
export const notOutliers = (s: Serie, mustache = 1.5): Serie => {
    const o = __ouliers__(s, mustache)
    return cut(s, v => v>=o.min && v<=o.max )
}

// -----------------------------------------

const __ouliers__ = (s: Serie, mustache: number) => {
    const Q25 = q25(s)
    const Q75 = q75(s)
    const iqr = Q75-Q25
    return {
        min: Q25 - mustache*iqr,
        max: Q75 + mustache*iqr
    }
}
