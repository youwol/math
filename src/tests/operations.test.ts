import {
    createArray,
    createEmptySerie,
    Serie,
    DataFrame,
    append,
    exists,
    apply,
} from '@youwol/dataframe'

import {
    dot,
    add,
    mult,
    eigenValue,
    trace,
    sub,
    norm,
    div,
    transpose,
    eigenVector,
    square,
    abs,
    cross,
    addNumber,
    weightedSum,
    sum,
    unitInterval,
    closeTo,
} from '../lib/dataframe'
import { equals } from '../lib/dataframe/equals'

test('operation add', () => {
    let df = DataFrame.create({
        series: {
            a: Serie.create({ array: new Array(20).fill(2), itemSize: 2 }),
            b: Serie.create({ array: new Array(20).fill(3), itemSize: 2 }),
        },
    })

    expect(exists(df, 'a')).toBeTruthy()
    expect(exists(df, 'b')).toBeTruthy()

    // ---------------------------------

    let sum = add([df.series.a, df.series.b])
    sum.array.forEach((_) => expect(_).toBe(5))

    // ---------------------------------

    const aa = addNumber(df.series.a, 100)
    aa.array.forEach((_) => expect(_).toBe(102))

    // ---------------------------------
    df = append(df, {
        sum: add([mult(df.series.a, 10), mult(df.series.b, 20)]),
    })
    sum = df.series.sum
    sum.array.forEach((_) => expect(_).toBe(80))

    // ---------------------------------

    df = append(df, {
        sum: add([
            mult(df.series.a, 10),
            mult(df.series.b, 20),
            mult(df.series.a, 1),
        ]),
    })
    sum = df.series.sum
    sum.array.forEach((_) => expect(_).toBe(82))
})

test('operation add multiple', () => {
    const df = DataFrame.create({
        series: {
            a: Serie.create({ array: new Array(20).fill(2), itemSize: 2 }),
            b: Serie.create({ array: new Array(20).fill(3), itemSize: 2 }),
            c: Serie.create({ array: new Array(20).fill(4), itemSize: 2 }),
            d: Serie.create({ array: new Array(20).fill(5), itemSize: 2 }),
            e: Serie.create({ array: new Array(20).fill(6), itemSize: 2 }),
        },
    })

    const all = [
        df.series.a,
        df.series.b,
        df.series.c,
        df.series.d,
        df.series.e,
    ]
    const a = add(all)
    a.array.forEach((_) => expect(_).toBe(20))
})

test('operation mult', () => {
    const df = DataFrame.create({
        series: {
            a: Serie.create({ array: new Array(20).fill(2), itemSize: 2 }),
            b: Serie.create({ array: new Array(20).fill(3), itemSize: 2 }),
            c: Serie.create({ array: new Array(20).fill(4), itemSize: 2 }),
        },
    })

    expect(exists(df, 'a')).toBeTruthy()
    expect(exists(df, 'b')).toBeTruthy()

    const a = mult(df.series.a, 100)
    a.array.forEach((_) => expect(_).toBe(200))

    const b = mult(df.series.a, df.series.b)
    b.array.forEach((_) => expect(_).toBe(6))

    const c = mult(df.series.b, df.series.a, df.series.c)
    c.array.forEach((_) => expect(_).toBe(24))
})

test('operation div', () => {
    const df = DataFrame.create({
        series: {
            a: Serie.create({ array: new Array(20).fill(2), itemSize: 2 }),
            b: Serie.create({ array: new Array(20).fill(3), itemSize: 2 }),
            c: Serie.create({ array: new Array(20).fill(2), itemSize: 2 }),
        },
    })

    const a = div(df.series.b, df.series.a)
    a.array.forEach((_) => expect(_).toBe(1.5))

    const b = div(df.series.a, 2)
    b.array.forEach((_) => expect(_).toBe(1))

    const c = div(df.series.b, df.series.a, df.series.c)
    c.array.forEach((_) => expect(_).toBe(0.75))
})

test('operation sub', () => {
    const df = DataFrame.create({
        series: {
            a: Serie.create({ array: new Array(20).fill(2), itemSize: 1 }),
            b: Serie.create({ array: new Array(20).fill(3), itemSize: 1 }),
            c: Serie.create({ array: new Array(20).fill(2), itemSize: 2 }),
        },
    })

    {
        const a = sub(df.series.b, df.series.a)
        a.array.forEach((_) => expect(_).toBe(1))
    }
    {
        const a = sub(df.series.b, 2)
        a.array.forEach((_) => expect(_).toBe(1))
    }
    {
        const a = sub(df.series.b, df.series.a, df.series.c)
        a.array.forEach((_) => expect(_).toEqual(-1))
    }
})

test('operation norm', () => {
    const df = DataFrame.create({
        series: {
            a: Serie.create({ array: new Array(9).fill(2), itemSize: 3 }),
        },
    })

    const a = norm(df.series.a)
    a.array.forEach((_) => expect(_).toEqual(Math.sqrt(12)))
})

test('operation superposition', () => {
    let df = DataFrame.create({
        series: {
            a: Serie.create({ array: new Array(20).fill(2), itemSize: 2 }),
            b: Serie.create({ array: new Array(20).fill(3), itemSize: 2 }),
        },
    })

    df = append(df, {
        ab: add([mult(df.series.a, 10), mult(df.series.b, 20)]),
    })
})

test('operation eigen', () => {
    {
        // λ_1 ≈ -0.516
        // λ_2 ≈  0.171
        // λ_3 ≈ 11.345
        const a = Serie.create({ array: [1, 2, 3, 4, 5, 6], itemSize: 6 })
        const ev = eigenValue(a)

        const solV = [11.345, 0.171, -0.516]
        let sol = [
            0.32798486199439997, 0.5910088626432869, 0.7369765631141895,
            -0.5921129671392705, 0.7364838159057536, -0.32709910280284965,
            0.7360897801545975, 0.32908982540635984, -0.5914995539862797,
        ]

        const vval = eigenValue(a)
        vval.array.forEach((v, i) => expect(v).toBeCloseTo(solV[i]))

        let vec = eigenVector(a)
        vec.array.forEach((v, i) => expect(v).toBeCloseTo(sol[i]))

        // Get the vector1
        sol = [0.32798486199439997, 0.5910088626432869, 0.7369765631141895]
        vec = eigenVector(a).map((v) => [v[0], v[1], v[2]])
        vec.array.forEach((v, i) => expect(v).toBeCloseTo(sol[i]))

        // Get the vector2
        sol = [-0.5921129671392705, 0.7364838159057536, -0.32709910280284965]
        vec = eigenVector(a).map((v) => [v[3], v[4], v[5]])
        vec.array.forEach((v, i) => expect(v).toBeCloseTo(sol[i]))

        // Get the vector3
        sol = [0.7360897801545975, 0.32908982540635984, -0.5914995539862797]
        vec = eigenVector(a).map((v) => [v[6], v[7], v[8]])
        vec.array.forEach((v, i) => expect(v).toBeCloseTo(sol[i]))
    }
})

test('operation trace', () => {
    {
        const df = DataFrame.create({
            series: {
                a: Serie.create({
                    array: [1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1],
                    itemSize: 6,
                }),
            },
        })

        const t = trace(df.series.a)
        expect(t.array[0]).toBe(11)
        expect(t.array[1]).toBe(10)
    }
    {
        const df = DataFrame.create({
            series: {
                a: Serie.create({
                    array: [
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1,
                    ],
                    itemSize: 9,
                }),
            },
        })

        const t = trace(df.series.a)
        expect(t.array[0]).toBe(15)
        expect(t.array[1]).toBe(15)
    }
    {
        const df = DataFrame.create({
            series: {
                a: Serie.create({ array: [1, 2, 3, 4, 5, 6], itemSize: 1 }),
            },
        })

        const t = trace(df.series.a)
        expect(t.array[0]).toBe(1)
        expect(t.array[1]).toBe(2)
        expect(t.array[5]).toBe(6)
    }
})

test('operation transpose', () => {
    const df = DataFrame.create({
        series: {
            a: Serie.create({
                array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                itemSize: 9,
            }),
        },
    })
    const t = transpose(df.series.a)
    expect(t.itemAt(0)).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9])
    expect(t.itemAt(1)).toEqual([9, 6, 3, 8, 5, 2, 7, 4, 1])
})

test('operation square', () => {
    let s = Serie.create({ array: [2, 3], itemSize: 1 })
    let t = square(s)
    expect(t.itemAt(0)).toBe(4)
    expect(t.itemAt(1)).toBe(9)

    s = Serie.create({ array: [2, 3, 4, 5], itemSize: 2 })
    t = square(s)
    expect(t.itemAt(0)).toEqual([4, 9])
    expect(t.itemAt(1)).toEqual([16, 25])
})

test('operation unitInterval', () => {
    let s = Serie.create({ array: [1, 2, 3], itemSize: 3 })
    let t = unitInterval(s)
    expect(t.itemAt(0)).toEqual([0, 1 / 2, 1])

    s = Serie.create({ array: [1, 2, 3], itemSize: 1 })
    t = unitInterval(s)
    expect(t.itemAt(0)).toBe(0)
    expect(t.itemAt(1)).toEqual(1 / 2)
    expect(t.itemAt(2)).toBe(1)
})

test('operation cross', () => {
    let a = Serie.create({ array: [2, 3, 4], itemSize: 3 })
    let b = Serie.create({ array: [5, 6, 7], itemSize: 3 })
    let t = cross(a, b)
    expect(t.itemAt(0)).toEqual([-3, 6, -3])

    a = Serie.create({ array: [2, 3, 4, 5, 6, 7], itemSize: 3 })
    b = Serie.create({ array: [5, 6, 7, -1, 4, 2], itemSize: 3 })
    t = cross(a, b)
    expect(t.itemAt(0)).toEqual([-3, 6, -3])
    expect(t.itemAt(1)).toEqual([-16, -17, 26])
})

test('operation sum', () => {
    const a = Serie.create({ array: [2, 3, 4, 5], itemSize: 1 })
    const b = Serie.create({ array: [2, 3, 4, 5], itemSize: 2 })

    expect(sum(a)).toEqual(2 + 3 + 4 + 5)
    expect(sum(b)).toEqual([2 + 4, 3 + 5])
})

test('operation abs', () => {
    let s = Serie.create({ array: [-2, -3], itemSize: 1 })
    let t = abs(s)
    expect(t.itemAt(0)).toBe(2)
    expect(t.itemAt(1)).toBe(3)

    s = Serie.create({ array: [-2, -3, -4, -5], itemSize: 2 })
    t = abs(s)
    expect(t.itemAt(0)).toEqual([2, 3])
    expect(t.itemAt(1)).toEqual([4, 5])
})

test('operation dot', () => {
    const s1 = Serie.create({ array: [1, 2, 3, 4, 5, 6], itemSize: 3 })
    const t = dot(s1, s1)
    expect(t.itemAt(0)).toEqual(1 + 4 + 9)
    expect(t.itemAt(1)).toEqual(16 + 25 + 36)
})

test('operation composition', () => {
    const df = DataFrame.create({
        series: {
            stress1: createEmptySerie({
                Type: Float32Array,
                count: 3,
                itemSize: 6,
                shared: true,
            }),
            stress2: createEmptySerie({
                Type: Float32Array,
                count: 3,
                itemSize: 6,
                shared: true,
            }),
            stress3: createEmptySerie({
                Type: Float32Array,
                count: 3,
                itemSize: 6,
                shared: true,
            }),
        },
    })

    const stress1 = df.series.stress1
    const stress2 = df.series.stress2
    const stress3 = df.series.stress3

    expect(stress1.count).toBe(3)
    expect(stress1.itemSize).toBe(6)
    expect(stress1).toHaveLength(18)

    const values = eigenValue(
        add([mult(stress1, 0.1), mult(stress2, 1.2), mult(stress3, -3.2)]),
    )

    //console.log(values)
    expect(values.count).toBeCloseTo(3)
    expect(values.itemSize).toBeCloseTo(3)
    expect(values.length).toBeCloseTo(9)

    // values.forEach( item => {
    //     expect(item[0]).toEqual(0)
    //     expect(item[1]).toEqual(0)
    //     expect(item[2]).toBeCloseTo(-7.8)
    // })
})

test('superposition', () => {
    const alpha = [1, 2, 3]

    const S1 = Serie.create({ array: createArray(18, (i) => i), itemSize: 6 })
    const S2 = Serie.create({
        array: createArray(18, (i) => i + 1),
        itemSize: 6,
    })
    const S3 = Serie.create({
        array: createArray(18, (i) => i + 2),
        itemSize: 6,
    })

    const sol = [
        8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110,
    ]

    const r1 = weightedSum([S1, S2, S3], alpha)
    r1.array.forEach((v, i) => expect(v).toEqual(sol[i]))

    const r2 = add([mult(S1, alpha[0]), mult(S2, alpha[1]), mult(S3, alpha[2])])
    // Note the r.array.forEach and not the r.forEach as below
    r2.array.forEach((v, i) => expect(v).toEqual(sol[i]))
})

test('weightedSum', () => {
    const S = [
        Serie.create({ array: createArray(18, (i) => i), itemSize: 6 }),
        Serie.create({ array: createArray(18, (i) => i + 1), itemSize: 6 }),
        Serie.create({ array: createArray(18, (i) => i + 2), itemSize: 6 }),
    ]

    const sol = [
        [8, 14, 20, 26, 32, 38],
        [44, 50, 56, 62, 68, 74],
        [80, 86, 92, 98, 104, 110],
    ]

    const r = weightedSum(S, [1, 2, 3])
    // Note the r.forEach and not the r.array.forEach as above
    r.forEach((v, i) => expect(v).toEqual(sol[i]))
})

test('equals', () => {
    {
        const S1 = Serie.create({ array: [1, 2, 3], itemSize: 1 })
        const S2 = Serie.create({ array: [1, 2, 3], itemSize: 1 })
        expect(equals(S1, S2)).toBeTruthy()
    }
    {
        const S1 = Serie.create({ array: [1, 2, 3], itemSize: 1 })
        const S2 = Serie.create({ array: [0, 2, 3], itemSize: 1 })
        expect(equals(S1, S2)).toBeFalsy()
    }
    {
        const S1 = Serie.create({ array: [1, 2, 3, 4], itemSize: 1 })
        const S2 = Serie.create({ array: [0, 2, 3], itemSize: 1 })
        expect(equals(S1, S2)).toBeFalsy()
    }
    {
        const S1 = Serie.create({ array: [1, 2, 3], itemSize: 3 })
        const S2 = Serie.create({ array: [0, 2, 3], itemSize: 1 })
        expect(equals(S1, S2)).toBeFalsy()
    }
})

test('closeTo', () => {
    {
        const S1 = Serie.create({ array: [1.01, 2, 3], itemSize: 1 })
        const S2 = Serie.create({ array: [1, 2, 3], itemSize: 1 })
        expect(closeTo(S1, S2, 0.02)).toBeTruthy()
        expect(closeTo(S1, S2, 0.001)).toBeFalsy()
    }
    {
        const S1 = Serie.create({ array: [1.01, 2, 3], itemSize: 3 })
        const S2 = Serie.create({ array: [1, 2, 3], itemSize: 1 })
        expect(closeTo(S1, S2)).toBeFalsy()
    }
})

test('neutral stress points', () => {
    const S1 = Serie.create({ array: [1.05, 2, 3], itemSize: 1 })
    const S2 = Serie.create({ array: [1, 2, 3], itemSize: 1 })
    const S3 = Serie.create({ array: [1, 2, 3], itemSize: 1 })

    const xp = 5 // 5%
    const d2 = mult(abs(sub(abs(div(S1, S2)), 1)), 100)
    const d3 = mult(abs(sub(abs(div(S1, S3)), 1)), 100)
    const d = apply(d2, (item, i) => (item < xp && d3.itemAt(i) < xp ? 1 : 0))
    // console.log(d)
})

test('', () => {
    const s1 = Serie.create({ array: [1, 2, 3], itemSize: 1 })
    const s2 = Serie.create({ array: [4, 5, 6], itemSize: 1 })
    const s3 = Serie.create({ array: [7, 8, 9], itemSize: 1 })
    // console.log( reduce([s1,s2,s3], ([s1, s2, s3]) => (s2-s3)/(s1-s3) ) )
})
