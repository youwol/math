import { DataFrame, Serie, Manager } from '@youwol/dataframe'
import { 
    PositionDecomposer, EigenValuesDecomposer, 
    ComponentDecomposer, EigenVectorsDecomposer
} from '../lib'

// class Manager {
//     private ds_: Decomposer[] = []
//     public readonly dimension: number = 3

//     // constructor(private readonly df: DataFrame, options: Decomposer[] = undefined, private dimension=3) {
//     //     if (options) this.ds_ = options
//     // }
//     /**
//      * Two usage of the constructor for compatibility reason:
//      * 
//      * - Old fashioned. By default the dimension is set to 3 and cannot be changed:
//      * ```ts
//      * const mng = new Manager(df, [
//      *     new PositionDecomposer, 
//      *     new ComponentDecomposer
//      * ])
//      * ```
//      * 
//      * - New way. You have to provide the dimension
//      * ```ts
//      * const mng = new Manager(df, {
//      *     decomposers: [
//      *         new PositionDecomposer, 
//      *         new ComponentDecomposer
//      *     ],
//      *     dimension: 2
//      * })
//      * ```
//      * @param df 
//      * @param options 
//      */
//     constructor(private readonly df: DataFrame, options: Decomposer[] | {decomposers: Decomposer[], dimension: number}) {
//         if (options) {
//             // For compatibility reason
//             if (Array.isArray(options)) {
//                 console.warn('Deprecated ctor for Manager')
//                 this.ds_ = options
//             }
//             else {
//                 if (options.decomposers) this.ds_ = options.decomposers
//                 if (options.dimension) this.dimension = options.dimension
//             }
//         }
//     }

//     add(d: Decomposer) {
//         this.ds_.push(d)
//     }

//     clear() {
//         this.ds_ = []
//     }

//     names(itemSize: number): string[] {
//         let names = new Set<string>()
//         Object.entries(this.df.series).forEach( ([name, serie]) => {
//             if (serie.itemSize === itemSize && serie.dimension === this.dimension) {
//                 if ( name !== 'positions' && name !== 'indices' ) {
//                     names.add(name)
//                 }
//             }
//             this.ds_.forEach( d => {
//                 d.names(this.df, itemSize, serie, name).forEach( n => names.add(n) )
//             })
//         })
//         return Array.from(names)
//     }

//     contains(itemSize: number, name: string): boolean {
//         const n = this.names(itemSize)
//         return n.includes(name)
//     }

//     serie(itemSize: number, name: string): Serie {
//         for (let [mname, serie] of Object.entries(this.df.series)) {
//             if (serie.itemSize===itemSize && name===mname) {
//                 return serie.clone(false)
//             }
//         }
//         for (let d of this.ds_) {
//             const serie = d.serie(this.df, itemSize, name)
//             if (serie) return serie
//         }
//         return undefined
//     }
// }

test('test 1 on Manager with dimension=2', () => {
    const df = DataFrame.create({
        series: {
            positions: Serie.create( {array: [1,2,3, 4,5,6], itemSize: 3} ),
            a        : Serie.create( {array: [4,9], itemSize: 1}),
            U        : Serie.create( {array: [6,5, 3,2], itemSize: 2, dimension: 2} ),
            S        : Serie.create( {array: [10,11,12, 16,17,18], itemSize: 3, dimension: 2} )
        }
    })

    const mng = new Manager(df, {
        decomposers: [
            new PositionDecomposer, 
            new ComponentDecomposer
        ],
        dimension: 2
    })
    
    const sol = [
        [ 'x', 'y', 'z', 'a', 'Ux', 'Uy', 'Sxx', 'Sxy', 'Syy' ], // itemSize = 1
        [ 'U' ], // itemSize = 2
        [ 'S' ], // itemSize = 3
        [ ],     // itemSize = 4
        [ ],     // itemSize = 6
        [ ]      // itemSize = 9
    ]
    
    sol[0].forEach( name => expect(mng.serie(1, name)).toBeDefined() )
    sol[1].forEach( name => expect(mng.serie(2, name)).toBeDefined() )
    sol[2].forEach( name => expect(mng.serie(3, name)).toBeDefined() )
    
})

test('test 1 on Manager with dimension=3', () => {
    const df = DataFrame.create({
        series: {
            positions: Serie.create( {array: [1,2,3, 4,5,6], itemSize: 3} ),
            a        : Serie.create( {array: [4,9], itemSize: 1}),
            U        : Serie.create( {array: [6,5,4, 3,2,1], itemSize: 3} ),
            S        : Serie.create( {array: [10,11,12,13,14,15, 16,17,18,19,20,21], itemSize: 6} )
        }
    })

    const mng = new Manager(df, {
        decomposers: [
            new PositionDecomposer, 
            new ComponentDecomposer
        ],
        dimension: 3
    })
    
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

test('test 2 on Manager with dimension=3', () => {
    const df = DataFrame.create({
        series: {
            U: Serie.create( {array: [6,5,4, 3,2,1], itemSize: 3} ),
            S: Serie.create( {array: [10,11,12,13,14,15, 16,17,18,19,20,21], itemSize: 6} )
        }
    })

    const mng = new Manager(df, {
        decomposers: [
            new PositionDecomposer, // does nothing since 'positions' serie does not exist
            new ComponentDecomposer,
            new EigenValuesDecomposer,
            new EigenVectorsDecomposer
        ],
        dimension: 3
    })
    
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
