import { eigen } from '../lib'
//import './toBeEspilonTo'

test('Eigen 1', () => {
    const {values, vectors} = eigen([1, 2, 3, 3, 4, 5])

    expect(values[0]).toBeCloseTo(9.62346134)
    expect(values[1]).toBeCloseTo( 0.00001403)
    expect(values[2]).toBeCloseTo(-0.62347537)

    expect(vectors[0]).toBeCloseTo(0.38558270)
    expect(vectors[1]).toBeCloseTo(0.55852366)
    expect(vectors[2]).toBeCloseTo(0.73442310)

    expect(vectors[3]).toBeCloseTo(-0.40788594)
    expect(vectors[4]).toBeCloseTo(0.81715402)
    expect(vectors[5]).toBeCloseTo(-0.40729395)

    expect(vectors[6]).toBeCloseTo(0.82762010)
    expect(vectors[7]).toBeCloseTo(0.14251535)
    expect(vectors[8]).toBeCloseTo(-0.54289440)
})

test('Eigen 2', () => {
    {
        const {values, vectors} = eigen([0.5, 0, 0, 0, 0.75, 0, 0, 0, 1])
        expect(values[0]).toBeCloseTo(1)
        expect(values[1]).toBeCloseTo(0.75)
        expect(values[2]).toBeCloseTo(0.5)
    }
    {
        const {values, vectors} = eigen([0.5, 0, 0, 0.75, 0, 1])
        expect(values[0]).toBeCloseTo(1)
        expect(values[1]).toBeCloseTo(0.75)
        expect(values[2]).toBeCloseTo(0.5)
    }
})

test('Eigen convention', () => {
    // Stress tensor
    //
    // -10   2  -1
    //   2 -13   3
    //  -1   3 -20
    //
    const {values, vectors} = eigen([-10, 2, -1, -13, 3, -20])
    expect(values[0]).toBeCloseTo(-8.978)
    expect(values[1]).toBeCloseTo(-12.672)
    expect(values[2]).toBeCloseTo(-21.350)

    const normalize = (x: number, y: number, z: number): [number, number, number] => {
        const l = Math.sqrt(x**2 + y**2 + z**2);
        return [x/l, y/l, z/l]
    }

    const S1 = normalize(17.863, 9.628, 1)
    const S2 = normalize(-1.163, 2.055, 1)
    const S3 = normalize(0.158, -0.397, 1)

    expect(vectors[0]).toBeCloseTo(S1[0])
    expect(vectors[1]).toBeCloseTo(S1[1])
    expect(vectors[2]).toBeCloseTo(S1[2])

    expect(vectors[3]).toBeCloseTo(S2[0])
    expect(vectors[4]).toBeCloseTo(S2[1])
    expect(vectors[5]).toBeCloseTo(S2[2])

    expect(vectors[6]).toBeCloseTo(S3[0])
    expect(vectors[7]).toBeCloseTo(S3[1])
    expect(vectors[8]).toBeCloseTo(S3[2])

    // Get the closest eigenvector close to the vertical
    const vals = [S1[2], S2[2], S3[2]]
    const id = vals.indexOf(Math.max(...vals)) // close to parallel
    const angle = Math.acos(vals[id])*180/Math.PI
    expect(id).toBe(2)
    expect(angle).toBeCloseTo(23.136)
})
