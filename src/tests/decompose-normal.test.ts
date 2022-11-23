import { DataFrame, Serie, Manager } from '@youwol/dataframe'
import { NormalsDecomposer } from '../lib/dataframe/decomposers'

test('test normals on AttributeManager', () => {
    const df = DataFrame.create({
        series: {
            positions: Serie.create( {array: [0,0,0, 1,0,0, 1,1,0], itemSize: 3} ),
            indices  : Serie.create( {array: [0,1,2], itemSize: 3} )
        }
    })

    const mng = new Manager(df, {
        decomposers: [
            new NormalsDecomposer('n')
        ],
        dimension: 3
    })
    
    expect(mng.names(3)).toEqual(['n'])

    const ns = mng.serie(3, 'n').array
    expect(ns[0]).toEqual(0)
    expect(ns[1]).toEqual(0)
    expect(ns[2]).toEqual(1)
})
