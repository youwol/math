import { Serie } from '@youwol/dataframe'
import { inv } from '../lib'

test('testing inv', () => {
    {
        const s = Serie.create({ array: [1, 2, 3, 4, 5, 6], itemSize: 6 })
        const is = inv(s)

        const sol6 = [1, -3, 2, 3, -1, 0]
        is.map(() => (v, i) => expect(v).toBeCloseTo(sol6[i]))
    }

    {
        const s = Serie.create({
            array: [2, 3, 1, 6, 5, 4, 7, 9, 8],
            itemSize: 9,
        })
        const is = inv(s)

        const sol9 = [
            -4 / 33,
            5 / 11,
            -7 / 33,
            20 / 33,
            -3 / 11,
            2 / 33,
            -19 / 33,
            -1 / 11,
            8 / 33,
        ]
        is.map(() => (v, i) => expect(v).toBeCloseTo(sol9[i]))
    }
})
