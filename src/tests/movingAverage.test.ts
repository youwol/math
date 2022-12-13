import { DataFrame, Serie } from '@youwol/dataframe'
import { movingAverage } from '../lib'

// import the extensions
// This will <augment> the module Serie with the necessary operations
import '../lib/dataframe/extensions'

test('moving average', () => {
    const positions = []
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            positions.push(i, j, 0)
        }
    }

    const df = DataFrame.create({
        series: {
            positions: Serie.create({ array: positions, itemSize: 3 }),
            attr: Serie.create({
                array: new Array(100).fill(0).map(() => Math.random()),
                itemSize: 1,
            }),
        },
    })

    const r = movingAverage(df, {
        lx: 1,
        ly: 1,
        Lx: 10,
        Ly: 10,
        nx: 5,
        ny: 5,
        name: 'attr',
    })
    // console.log(r)
    expect(r['nx']).toBeDefined()
    expect(r['ny']).toBeDefined()
    expect(r['positions']).toBeDefined()
    expect(r['solution']).toBeDefined()
})
