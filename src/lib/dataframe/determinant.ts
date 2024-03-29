import { Serie, squaredMatrix, symSquaredMatrix } from '@youwol/dataframe'

/**
 * Get the determinant of each item of a [[Serie]] (if matrix).
 * itemSize should (for the moment) either 6 (symmetric matrix) or 9.
 * @category Dataframe
 */
export function determinant(s: Serie) {
    if (s === undefined) {
        throw new Error('series is undefined')
    }

    if ((s.itemSize === 3 || s.itemSize === 4) && s.dimension === 2) {
        const matrix = (v: number[]) =>
            v.length === 3 ? symSquaredMatrix(v) : squaredMatrix(v)
        return s.map((v) => {
            const m = matrix(v)
            return m.at(0, 0) * m.at(1, 1) - m.at(0, 1) * m.at(1, 0)
        })
    } else if ((s.itemSize === 6 || s.itemSize === 9) && s.dimension === 3) {
        const matrix = (v: number[]) =>
            v.length === 6 ? symSquaredMatrix(v) : squaredMatrix(v)
        return s.map((v) => {
            const m = matrix(v)
            return (
                m.at(0, 0) * m.at(1, 1) * m.at(2, 2) -
                m.at(0, 0) * m.at(1, 2) * m.at(2, 1) -
                m.at(0, 1) * m.at(1, 0) * m.at(2, 2) +
                m.at(0, 1) * m.at(1, 2) * m.at(2, 0) +
                m.at(0, 2) * m.at(1, 0) * m.at(2, 1) -
                m.at(0, 2) * m.at(1, 1) * m.at(2, 0)
            )
        })
    } else {
        throw new Error('item size should be 3, 4, 6 or 9')
    }
}
