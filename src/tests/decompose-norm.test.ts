import { DataFrame, Serie, Manager } from '@youwol/dataframe'
import { VectorNormDecomposer } from '../lib/dataframe/decomposers'

test('norm decomposer', () => {
    const df = DataFrame.create({
        series: {
            U: Serie.create({
                array: [1, 2, 3, 6, 5, 4, 9, 5, 7],
                itemSize: 3,
            }),
        },
    })

    const norm = (p) => Math.sqrt(p[0] ** 2 + p[1] ** 2 + p[2] ** 2)

    const mng = new Manager(df, {
        decomposers: [new VectorNormDecomposer()],
        dimension: 3,
    })

    expect(mng.names(1)).toEqual(['U'])
    expect(mng.serie(1, 'U').array).toEqual([
        norm([1, 2, 3]),
        norm([6, 5, 4]),
        norm([9, 5, 7]),
    ])
})

test('norm decomposer excluding positions and indices', () => {
    const df = DataFrame.create({
        series: {
            positions: Serie.create({
                array: [1, 2, 3, 6, 5, 4, 9, 5, 7],
                itemSize: 3,
            }),
            indices: Serie.create({
                array: [1, 2, 3, 6, 5, 4, 9, 5, 7],
                itemSize: 3,
            }),
            U: Serie.create({
                array: [1, 2, 3, 6, 5, 4, 9, 5, 7],
                itemSize: 3,
            }),
        },
    })

    const norm = (p) => Math.sqrt(p[0] ** 2 + p[1] ** 2 + p[2] ** 2)

    const mng = new Manager(df, {
        decomposers: [new VectorNormDecomposer()],
        dimension: 3,
    })

    expect(mng.names(1)).toEqual(['U'])
    expect(mng.serie(1, 'U').array).toEqual([
        norm([1, 2, 3]),
        norm([6, 5, 4]),
        norm([9, 5, 7]),
    ])
})
