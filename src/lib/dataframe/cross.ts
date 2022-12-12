import { Serie } from '@youwol/dataframe'

/**
 * Cross product only for [[Serie]]s with itemSize=3
 * @category Dataframe
 */
export const cross = (A: Serie, B: Serie): Serie => {
    if (A === undefined) {
        throw new Error('serie A is undefined')
    }
    if (B === undefined) {
        throw new Error('serie B is undefined')
    }
    if (A.itemSize !== 3) {
        throw new Error('cross only supports itemSize=3')
    }
    if (B.itemSize !== 3) {
        throw new Error('cross only supports itemSize=3')
    }

    return A.map((a, i) => {
        const b = B.itemAt(i)
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ]
    })
}
