import { Serie } from '@youwol/dataframe'
import { getRotationAxis } from '..'
import { rotate } from '../lib/dataframe'

test('rotate serie of rots', () => {
    const s = 0.707
    const rot = Serie.create({
        array: [s, 0, s, s, 0, -s, 0, 1, 0],
        itemSize: 9,
    })
    const M = Serie.create({ array: [9, 8, 7, 6, 5, 4], itemSize: 6 })

    const sol = [
        13.49592, 2.49924, 9.191, 2.49924, -0.49985, 2.121, 9.191, 2.121, 6.0,
    ]
    const R = rotate(M, rot)
    R.forEach((b) => b.forEach((v, i) => expect(v).toBeCloseTo(sol[i])))
})

test('rotate one rot', () => {
    const rot = getRotationAxis('z', 45)

    const M = Serie.create({ array: [9, 8, 7, 6, 5, 4], itemSize: 6 })
    const R = rotate(M, rot)

    const sol = [-0.5, 1.5, 1.414, 15.5, 8.485, 4]
    // const sol = [13.49592, 2.49924, 9.19100, 2.49924, -0.49985, 2.12100, 9.19100, 2.12100, 6.00000]
    R.forEach((b) => b.forEach((v, i) => expect(v).toBeCloseTo(sol[i])))
})
