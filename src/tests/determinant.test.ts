import { Serie } from '@youwol/dataframe'
import { determinant } from '../lib/dataframe/determinant'

test('dataframe det 9', () => {
    const s = Serie.create({array: [1,2,3,6,5,4,7,81,91], itemSize: 9})
    const d = determinant(s)
    expect(d.array[0]).toBeCloseTo(448)
})

test('dataframe det 6', () => {
    const s = Serie.create({array: [1,2,3,5,4,91], itemSize: 6})
    const d = determinant(s)
    expect(d.array[0]).toBeCloseTo(78)
})
