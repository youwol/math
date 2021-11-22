import { DataFrame, Serie, Manager } from '@youwol/dataframe'
import { 
    PositionDecomposer, EigenValuesDecomposer, 
    ComponentDecomposer, EigenVectorsDecomposer
} from '../lib'


test('test 1 on Manager', () => {
    const df = DataFrame.create({
        series: {
            positions: Serie.create( {array: [1,2,3, 4,5,6], itemSize: 3} ),
            a        : Serie.create( {array: [4,9], itemSize: 1}),
            U        : Serie.create( {array: [6,5,4, 3,2,1], itemSize: 3} ),
            S        : Serie.create( {array: [10,11,12,13,14,15, 16,17,18,19,20,21], itemSize: 6} )
        }
    })

    const mng = new Manager(df, [
        new PositionDecomposer, 
        new ComponentDecomposer
    ])
    
    const sol = [
        [ 'x',   'y',   'z', 'a',  'Ux', 'Uy',  'Uz',  'Sxx', 'Sxy', 'Sxz', 'Syy', 'Syz', 'Szz' ],
        [ 'U' ],
        [ 'S' ],
        [ ]
    ]
    const sizes = [1, 3, 6, 9]
    sizes.forEach( (size,i) => expect(mng.names(size)).toEqual(sol[i]) )

    let names = mng.names(1)
    expect(mng.serie(1, 'x').array).toEqual([1,4])
    expect(mng.serie(1, 'y').array).toEqual([2,5])
    expect(mng.serie(1, 'z').array).toEqual([3,6])
    expect(mng.serie(1, 'a').array).toEqual([4,9])
    expect(mng.serie(1, 'Ux').array).toEqual([6,3])
    expect(mng.serie(1, 'Uy').array).toEqual([5,2])
    expect(mng.serie(1, 'Uz').array).toEqual([4,1])
    expect(mng.serie(1, 'Sxx').array).toEqual([10,16])
    expect(mng.serie(1, 'Sxy').array).toEqual([11,17])
    expect(mng.serie(1, 'Sxz').array).toEqual([12,18])
    expect(mng.serie(1, 'Syy').array).toEqual([13,19])
    expect(mng.serie(1, 'Syz').array).toEqual([14,20])
    expect(mng.serie(1, 'Szz').array).toEqual([15,21])


    expect(mng.names(3)).toEqual(['U'])
    expect(mng.serie(3, 'positions').array).toEqual([ 1, 2, 3, 4, 5, 6 ])
    expect(mng.serie(3, 'U').array).toEqual([ 6, 5, 4, 3, 2, 1 ])

    expect(mng.names(6)).toEqual(['S'])
    expect(mng.serie(6, 'S').array).toEqual([10,11,12,13,14,15,16,17,18,19,20,21])
})

test('test 2 on Manager', () => {
    const df = DataFrame.create({
        series: {
            U: Serie.create( {array: [6,5,4, 3,2,1], itemSize: 3} ),
            S: Serie.create( {array: [10,11,12,13,14,15, 16,17,18,19,20,21], itemSize: 6} )
        }
    })

    const mng = new Manager(df, [
        new PositionDecomposer, // does nothing since 'positions' serie does not exist
        new ComponentDecomposer,
        new EigenValuesDecomposer,
        new EigenVectorsDecomposer
    ])
    
    const sol1 = [ 'Ux', 'Uy',  'Uz',  'Sxx', 'Sxy', 'Sxz', 'Syy', 'Syz', 'Szz', 'S1', 'S2', 'S3' ]
    expect(mng.names(1)).toEqual(sol1)

    const sol3 = [ 'U', 'S1', 'S2', 'S3' ]
    expect(mng.names(3)).toEqual(sol3)

    expect(mng.serie(1, 'S1').array[0]).toBeCloseTo(37.627222642320596)
    expect(mng.serie(1, 'S1').array[1]).toBeCloseTo(55.53147275348018)

    expect(mng.serie(1, 'S2').array[0]).toBeCloseTo(0.43401186298916355)
    expect(mng.serie(1, 'S2').array[1]).toBeCloseTo(0.5042400105196401)

    expect(mng.serie(1, 'S3').array[0]).toBeCloseTo(-0.061234505309754744)
    expect(mng.serie(1, 'S3').array[1]).toBeCloseTo(-0.03571276399982312)
})
