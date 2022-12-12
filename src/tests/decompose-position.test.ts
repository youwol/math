import { DataFrame, Serie, Manager } from '@youwol/dataframe'
import { PositionDecomposer } from '../lib/dataframe/decomposers'

const df = DataFrame.create({
    series: {
        positions: Serie.create({
            array: [1, 2, 3, 6, 5, 4, 9, 5, 7],
            itemSize: 3,
        }),
    },
})

test('position decomposer', () => {
    const mng = new Manager(df, {
        decomposers: [
            new PositionDecomposer(), // default names are ['x', 'y', 'z']
        ],
        dimension: 3,
    })

    expect(mng.names(1)).toEqual(['x', 'y', 'z'])
    expect(mng.serie(1, 'x').array).toEqual([1, 6, 9])
    expect(mng.serie(1, 'y').array).toEqual([2, 5, 5])
    expect(mng.serie(1, 'z').array).toEqual([3, 4, 7])
})

test('position decomposer with renaming', () => {
    const mng = new Manager(df, {
        decomposers: [new PositionDecomposer(['X0', 'X1', 'X2'])],
        dimension: 3,
    })

    expect(mng.names(1)).toEqual(['X0', 'X1', 'X2'])
    expect(mng.serie(1, 'X0').array).toEqual([1, 6, 9])
    expect(mng.serie(1, 'X1').array).toEqual([2, 5, 5])
    expect(mng.serie(1, 'X2').array).toEqual([3, 4, 7])
})
