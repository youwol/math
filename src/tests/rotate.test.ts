import { Serie }  from '@youwol/dataframe'
import { rotate } from '../lib/dataframe'

test('rotate', () => {
    const s   = 0.707
    const rot = Serie.create( {array: [s, 0, s, s, 0, -s, 0, 1, 0], itemSize: 9})
    const M   = Serie.create( {array: [9, 8, 7, 6, 5, 4], itemSize: 6})
    
    const sol = [13.49592, 2.49924, 9.19100, 2.49924, -0.49985, 2.12100, 9.19100, 2.12100, 6.00000]
    const R   = rotate(M, rot)
    R.forEach( b => b.forEach( (v,i) => expect(v).toBeCloseTo(sol[i]) ) )
})
