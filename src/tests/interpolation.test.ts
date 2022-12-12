import { triangleLerp2D, biLerp, lerp , meshInterpolate, InterpolateDirection } from '../lib'

/*

bilerp(p, pmin, pmax, Q11, Q12, Q21, Q22)

   Q21   Q22
    *-----*
    |     |
    |     |
    *-----* -------> x
   Q11   Q21
*/

test('bilerp', () => {
    expect( lerp(3, 2, 10, 0, 1) ).toBeCloseTo(0.125)
    expect( biLerp([1,1], [0,0], [5,5], 0, 5, 3, 1) ).toBeCloseTo(1.32)
    expect( biLerp([3,3], [1,2], [7,9], 0, 5, 3, 1) ).toBeCloseTo(1.38)
    expect( biLerp([3,5], [1,2], [7,9], 0, 5, 3, 1) ).toBeCloseTo(2.14)
})

test('triangleLerp2D', () => {
    let v = triangleLerp2D([1,1], [1,1], [5,3], [2,5], 1, 3, 2)
    expect(v).toBeCloseTo(1)

    v = triangleLerp2D([5,3], [1,1], [5,3], [2,5], 1, 3, 2)
    expect(v).toBeCloseTo(3)

    v = triangleLerp2D([2,5], [1,1], [5,3], [2,5], 1, 3, 2)
    expect(v).toBeCloseTo(2)
})






// -------------------------------------------------------------------------
// INTERPOLATION OF ATTRIBUTES using Topological information
// -------------------------------------------------------------------------

/*
      1
     /\
   /    \
 /        \
0 -------- 2
 |        |
 |        |
4 -------- 3

*/

const topology = [[0,1,2], [0,2,3,4]]

test('interpolate with scalar in INCREASING direction', () => {
    const attribute = [0, 1, 2, 3, 4]

    const faces = meshInterpolate({attribute, topology})

    const V = [1, 2.25]
    faces.forEach( (v: number, i: number) => {
        expect(v).toEqual(V[i])
    })
})

test('interpolate with vector3 in INCREASING direction', () => {
    const attribute = [[0,0,0], [1,1,1], [2,2,2], [3,3,3], [4,4,4]]

    const faces = meshInterpolate({attribute, topology})

    const V = [[ 1, 1, 1 ], [ 2.25, 2.25, 2.25 ]]
    faces.forEach( (v: Array<number>, i: number) => {
        expect(v).toEqual(V[i])
    })
})

test('interpolate with scalar in DECREASING direction', () => {
    const attribute = [1, 3]

    const nodes = meshInterpolate({attribute, topology, direction: InterpolateDirection.DECREASING})

    const V = [2, 1, 2, 3, 3]
    nodes.forEach( (v: number, i: number) => {
        expect(v).toEqual(V[i])
    })
})

test('interpolate with vector3 in DECREASING direction', () => {
    const attribute = [[1,2,3], [4,5,6]]

    const nodes = meshInterpolate({attribute, topology, direction: InterpolateDirection.DECREASING})

    const V = [[ 2.5, 3.5, 4.5 ], [ 1, 2, 3 ], [ 2.5, 3.5, 4.5 ], [ 4, 5, 6 ], [ 4, 5, 6 ]]
    nodes.forEach( (v: number, i: number) => {
        expect(v).toEqual(V[i])
    })
})
