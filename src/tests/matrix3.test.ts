import { getRotationAxis, mat } from '../lib'

test('rot 2 mat and compare', () => {
    const m = [
        [1, 2, 3],
        [2, 4, 5],
        [3, 5, 6],
    ] as mat.Matrix3

    const rot = [
        [0.7071068, -0.7071068, 0.0],
        [0.7071068, 0.7071068, 0.0],
        [0.0, 0.0, 1.0],
    ] as mat.Matrix3

    const m1 = mat.rotate(m, 45, 'z')
    const m2 = mat.multMat(rot, mat.multMat(m, mat.transpose(rot)))

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            expect(m1[i][j]).toBeCloseTo(m2[i][j])
        }
    }
})

test('multMat', () => {
    const m1 = [
        [1, 2, 3],
        [4, 4, 5],
        [6, 2, 24],
    ] as mat.Matrix3

    const m2 = [
        [4, 2, 1],
        [9, -1, 5],
        [-3, 2, 7],
    ] as mat.Matrix3

    const m3 = mat.multMat(m1, m2)

    expect(m3[0][0]).toBeCloseTo(13)
    expect(m3[0][1]).toBeCloseTo(6)
    expect(m3[0][2]).toBeCloseTo(32)
    expect(m3[1][0]).toBeCloseTo(37)
    expect(m3[1][1]).toBeCloseTo(14)
    expect(m3[1][2]).toBeCloseTo(59)
    expect(m3[2][0]).toBeCloseTo(-30)
    expect(m3[2][1]).toBeCloseTo(58)
    expect(m3[2][2]).toBeCloseTo(184)
})

test('rot mat forward', () => {
    const m = [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ] as mat.Matrix3

    const rot = getRotationAxis('z', 45)
    let m1 = mat.rotate(m, 45, 'z')
    let m2 = mat.rotateForward(m, rot)
    let sol = [
        [0.5, 0.5, 0],
        [0.5, 0.5, 0],
        [0, 0, 0],
    ]

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            expect(m1[i][j]).toBeCloseTo(m2[i][j])
            expect(m1[i][j]).toBeCloseTo(sol[i][j])
        }
    }

    m1 = mat.rotate(m1, 45, 'z')
    m2 = mat.rotateForward(m2, rot)
    sol = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ]

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            expect(m1[i][j]).toBeCloseTo(m2[i][j])
            expect(m1[i][j]).toBeCloseTo(sol[i][j])
        }
    }
})

test('rot mat inverse', () => {
    const m = [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ] as mat.Matrix3

    const rot = getRotationAxis('z', 45)
    let m1 = mat.rotate(m, -45, 'z')
    let m2 = mat.rotateInverse(m, rot)
    let sol = [
        [0.5, -0.5, 0],
        [-0.5, 0.5, 0],
        [0, 0, 0],
    ]

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            expect(m1[i][j]).toBeCloseTo(m2[i][j])
            expect(m1[i][j]).toBeCloseTo(sol[i][j])
        }
    }

    m1 = mat.rotate(m1, -45, 'z')
    m2 = mat.rotateInverse(m2, rot)
    sol = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ]

    // console.log(m1, m2)

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            expect(m1[i][j]).toBeCloseTo(m2[i][j])
            expect(m1[i][j]).toBeCloseTo(sol[i][j])
        }
    }
})

test('rot mat 90 CW', () => {
    const m = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ] as mat.Matrix3

    // rot 90° CCW
    const rotCCW = [
        [0.0, -1.0, 0.0],
        [1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0],
    ] as mat.Matrix3

    // rot 90° CW
    const rotCW = [
        [0.0, 1.0, 0.0],
        [-1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0],
    ] as mat.Matrix3

    {
        const m1 = mat.rotateForward(m, rotCCW)
        const m2 = mat.rotateInverse(m, rotCW)
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                expect(m1[i][j]).toBeCloseTo(m2[i][j])
            }
        }
    }

    // --------------------------

    {
        const m1 = mat.rotateForward(m, rotCW)
        const m2 = mat.rotateInverse(m, rotCCW)
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                expect(m1[i][j]).toBeCloseTo(m2[i][j])
            }
        }
    }
})
