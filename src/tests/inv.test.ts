import { Serie } from '@youwol/dataframe'
import { inv } from '../lib'

test('testing inv', () => {
    const s = Serie.create({array: [1, 2, 3, 4, 5,6], itemSize: 6})
    const is = inv(s)

    console.log(is)
    //is.map( m => expect(m).toEqual([ 1, -3, 2, 3, -1, 0 ]) )
})