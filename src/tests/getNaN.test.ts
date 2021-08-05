import { Serie } from '@youwol/dataframe'
import { getNaN } from '../lib'


test('test getNaN', () => {
    const S1 = Serie.create( {array: [1.01, Number.NaN, 3], itemSize: 1})
    const n1 = getNaN(S1)
    expect(n1.length).toEqual(1)
    expect(n1[0]).toEqual(1)

    const S2 = Serie.create( {array: [1, 2,  3, 4, Number.NaN, 5], itemSize: 2})
    const n2 = getNaN(S2)
    console.log(n2)
    expect(n2.length).toEqual(1)
    expect(n2[0]).toEqual(2)
})
