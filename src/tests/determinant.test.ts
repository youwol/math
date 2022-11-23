import { Serie } from '@youwol/dataframe'
import { determinant } from '../lib/dataframe/determinant'

test('dataframe det is=9', () => {
    const s = Serie.create({array: [1,2,3,6,5,4,7,81,91], itemSize: 9})
    const d = determinant(s)
    expect(d.array[0]).toBeCloseTo(448)
})

test('dataframe det is=6', () => {
    const s = Serie.create({array: [1,2,3,5,4,91], itemSize: 6})
    const d = determinant(s)
    expect(d.array[0]).toBeCloseTo(78)
})

test('dataframe det is=4', () => {
    const s = Serie.create({array: [1,2,3,5], itemSize: 4, dimension: 2})
    const d = determinant(s)
    expect(d.array[0]).toBeCloseTo(-1)
})

test('dataframe det is=3', () => {
    const s = Serie.create({array: [1,2,3], itemSize: 3, dimension: 2})
    const d = determinant(s)
    expect(d.array[0]).toBeCloseTo(-1)
})