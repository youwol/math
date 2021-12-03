import { Serie } from '@youwol/dataframe'

/**
 * @category Dataframe
 */
export const scale = (s: Serie, t: number[] | number): Serie => {
    if (s === undefined) throw new Error ('s is undefined')
    if (t === undefined) throw new Error ('t is undefined')

    if (Array.isArray(t)) {
        if (s.itemSize === 1) {
            return s.map( v => v*t[0] )
        }
        else {
            if (t.length !== s.itemSize) {
                throw new Error (`t should be of length ${s.itemSize} (same as serie itemSize)`)
            }
            return s.map( v => v.map( (w,i) => w*t[i] ))
        }
    }

    if (s.itemSize === 1) {
        return s.map( v => v*t )
    }

    return s.map( v => v.map( w => w*t ) )
}
