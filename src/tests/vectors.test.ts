import { vec } from '../lib/vectors'

test('operation norm', () => {
    const v = [1, 2, 3]
    const a = vec.norm(v)
    expect(a).toBeCloseTo(Math.sqrt(14))
})

function crossTest(v: vec.Vector3, w: vec.Vector3, result: vec.Vector3) {
    const t = vec.cross(v, w)
    expect(t[0]).toEqual(result[0])
    expect(t[1]).toEqual(result[1])
    expect(t[2]).toEqual(result[2])
}

test('operation cross', () => {
    crossTest([2, 3, 4], [5, 6, 7], [-3, 6, -3])
    crossTest([5, 6, 7], [-1, 4, 2], [-16, -17, 26])
    expect(1).toBe(1) // hack for eslint who cannot see that some tests are performed
})
