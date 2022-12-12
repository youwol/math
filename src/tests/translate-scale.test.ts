import { Serie } from '@youwol/dataframe'
import { scale } from '../lib/dataframe/scale'
import { translate } from '../lib/dataframe/translate'

test('translate serie', () => {
    const s = Serie.create({
        array: [1, 2, 3, 6, 5, 4, 7, 81, 91],
        itemSize: 3,
    })
    const d = translate(s, [1, 2, 3])

    const r = [2, 4, 6, 7, 7, 7, 8, 83, 94]

    r.forEach((v, i) => expect(d.array[i]).toEqual(v))
})

test('scale scalar serie', () => {
    const s = Serie.create({ array: [1, 2, 3, 6, 5, 4], itemSize: 3 })
    const d = scale(s, 2)

    const r = [2, 4, 6, 12, 10, 8]

    r.forEach((v, i) => expect(d.array[i]).toEqual(v))
})

test('scale vector serie', () => {
    const s = Serie.create({ array: [1, 2, 3, 6, 5, 4], itemSize: 3 })
    const d = scale(s, [1, 2, 3])

    const r = [1, 4, 9, 6, 10, 12]

    r.forEach((v, i) => expect(d.array[i]).toEqual(v))
})
