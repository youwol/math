import { Serie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const translate = (s: Serie, t: number[]): Serie => {
    if (s === undefined) {throw new Error ('s is undefined')}
    if (t === undefined) {throw new Error ('t is undefined')}
    if (t.length !== s.itemSize) {throw new Error (`t should be of length ${s.itemSize} (same as serie itemSize)`)}

    if (s.itemSize === 1) {
        return s.map( v => v*t[0] )
    }

    return s.map( v => v.map( (w,i) => w+t[i] ))
}
