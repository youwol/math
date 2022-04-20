import { Serie } from "@youwol/dataframe";
import { minMax } from "../minMax";

/**
 * Bin a serie using either the size of a bin or the number of bins. If the start is not
 * provided, the minimum of the serie is used. If the stop is not provided, the maximum
 * of the serie is used.
 * @example
 * ```js
 * const b1 = bins(serie, {size:5, start:0, stop: 90})
 * const b2 = bins(serie, {nb: 18, start:0, stop: 90})
 * const b3 = bins(serie, {nb: 20})
 * ```
 */
export function bins(serie: Serie, {size, nb, start, stop}:{size?: number, nb?: number, start?:number, stop?:number}): Serie {
    if (serie.itemSize !== 1) throw new Error('itemSize should be 1')
    if (size === undefined && nb === undefined) throw new Error('size or nb must be provided')

    const m = minMax(serie)
    if (start === undefined) {
        start = m[0]
    }
    if (stop === undefined) {
        stop = m[1]
    }

    if (nb !== undefined) {
        size = (stop-start)/nb
    }
    else {
        nb = Math.trunc(stop-start)/size
    }

    // binning
    const b = new Array(nb).fill(0)
    serie.forEach( v => {
        let i = Math.trunc((v-start)/size)
        if (i>=nb) i = nb-1
        if (i<0 || i>=nb) throw new Error(`index for bin (${i}) out of bounds (0, ${nb})`)
        b[i]++
    })

    return Serie.create({array: b, itemSize:1})
}