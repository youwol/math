import { Serie }   from '@youwol/dataframe'
import { multMat } from '../lib/dataframe'

test('multMat vec3', () => {
    let B, sol, R
    const A = Serie.create( {array: [9, 8, 7], itemSize: 3})

    R   = multMat(A, 2) // <------------------- scalar
    sol = [9*2, 8*2, 7*2]
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )

    B   = Serie.create( {array: [1, 2, 3], itemSize: 3})
    sol = 9+8*2+7*3
    R   = multMat(A,B)
    R.forEach( b => expect(b).toEqual(sol) )
})

test('multMat mat6', () => {
    let B, sol, R
    const A = Serie.create( {array: [9, 8, 7, 6, 5, 4], itemSize: 6})

    R   = multMat(A, 2) // <------------------- scalar
    sol = [9*2, 8*2, 7*2, 6*2, 5*2, 4*2]
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )

    B   = Serie.create( {array: [1, 2, 3], itemSize: 3})
    sol = [46, 35, 29]
    R   = multMat(A,B)
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )

    B   = Serie.create( {array: [1, 2, 3, 4, 5, 6], itemSize: 6})
    sol = [46, 85, 109, 35, 65, 84, 29, 54, 70]
    R   = multMat(A,B)
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )

    B   = Serie.create( {array: [1, 2, 3, 4, 5, 6, 7, 8, 9], itemSize: 9})
    sol = [90, 114, 138, 67, 86, 105, 55, 71, 87]
    R   = multMat(A,B)
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )
})

test('multMat mat9', () => {
    let B, sol, R
    const A = Serie.create( {array: [1, 2, 3, 4, 5, 6, 7, 8, 9], itemSize: 9})

    R   = multMat(A, 2) // <------------------- scalar
    sol = [1*2, 2*2, 3*2, 4*2, 5*2, 6*2, 7*2, 8*2, 9*2]
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )

    B = Serie.create( {array: [1, 2, 3], itemSize: 3})
    sol = [14, 32, 50]
    R = multMat(A,B)
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )

    B = Serie.create( {array: [9, 8, 7, 6, 5, 4], itemSize: 6})
    sol = [46, 35, 29, 118, 92, 77, 190, 149, 125]
    R = multMat(A,B)
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )

    B = Serie.create( {array: [9, 8, 7, 6, 5, 4, 3, 2, 1], itemSize: 9})
    sol = [30, 24, 18, 84, 69, 54, 138, 114, 90]
    R = multMat(A,B)
    R.forEach( b => b.forEach( (v,i) => expect(v).toEqual(sol[i]) ) )
})
