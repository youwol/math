import { mat } from '../lib'

test('Mat3 test ', () => {
    let m = [
        [1, 2, 3],
        [2, 4, 5],
        [3, 5, 6]
    ] as mat.Matrix3
  
    m = mat.rotate(m, 45, 'z')
  
    const expected = [
      45 / 10,
      15 / 10,
      4 * Math.sqrt(2),
      5 / 10,
      Math.sqrt(2),
      6]
  
    expect(m[0][0]).toBeCloseTo(expected[0])
    expect(m[0][1]).toBeCloseTo(expected[1])
    expect(m[0][2]).toBeCloseTo(expected[2])
    expect(m[1][1]).toBeCloseTo(expected[3])
    expect(m[1][2]).toBeCloseTo(expected[4])
    expect(m[2][2]).toBeCloseTo(expected[5])
})
