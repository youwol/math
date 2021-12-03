import { barycentric2 } from '../lib'

test('barycentric2', () => {
    let v

    v = barycentric2([1,1], [1,1], [5,3], [2,5])
    expect(v[0]).toBeCloseTo(1)
    expect(v[1]).toBeCloseTo(0)
    expect(v[2]).toBeCloseTo(0)

    v = barycentric2([5,3], [1,1], [5,3], [2,5])
    expect(v[0]).toBeCloseTo(0)
    expect(v[1]).toBeCloseTo(1)
    expect(v[2]).toBeCloseTo(0)

    v = barycentric2([2,5], [1,1], [5,3], [2,5])
    expect(v[0]).toBeCloseTo(0)
    expect(v[1]).toBeCloseTo(0)
    expect(v[2]).toBeCloseTo(1)

    v = barycentric2([2,3], [1,1], [5,3], [2,5])
    expect(v[0]).toBeGreaterThanOrEqual(0)
    expect(v[0]).toBeLessThanOrEqual(1)
    expect(v[1]).toBeGreaterThanOrEqual(0)
    expect(v[1]).toBeLessThanOrEqual(1)
    expect(v[2]).toBeGreaterThanOrEqual(0)
    expect(v[2]).toBeLessThanOrEqual(1)
})
