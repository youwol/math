import { Serie } from '@youwol/dataframe'

/**
 * Only transpose matrix in the form of arrays of size 9
 * @category Dataframe
 */
 export const transpose = (s: Serie) => {
    if (s === undefined) {return undefined}
    if (s.itemSize!==9) {throw new Error('items size should be 9 only (for now)')}

    const r = s.clone()
    const a = r.array

    let id = 0
    s.forEach( (item) => {
        a[id++] = item[0]; a[id++] = item[3]; a[id++] = item[6]
        a[id++] = item[1]; a[id++] = item[4]; a[id++] = item[7]
        a[id++] = item[2]; a[id++] = item[5]; a[id++] = item[8]
    })

    return r
}
