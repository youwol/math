import { Serie } from '@youwol/dataframe'

// See https://stackoverflow.com/questions/54328275/math-js-is-slow-to-multiply-2-big-matrices ?
// See https://github.com/josdejong/mathjs
// See https://github.com/R-js/blasjs
// See https://github.com/gpujs/gpu.js/
// See https://stdlib.io/docs/api/v0.0.90/

/*
 * @example
 * Perform: `w = M * v, where M are symmetric matrices (size 3x3) and v vectors (size 3)`
 * ```ts
 * let df = new DataFrame()
 *      .set('M', createSerie(new Array(20).fill(2), 6))
 *      .set('v', createSerie(new Array(20).fill(3), 3))
 * 
 * const w = mult( df.get('M'), df.get('v') )
 * ```
 * @example
 * Perform: `M = M1 * M2, where M1 and M2 are non-symmetric matrices of size 9 (3x3)`
 * ```ts
 * let df = new DataFrame()
 *      .set('M1', createSerie(new Array(20).fill(2), 9))
 *      .set('M2', createSerie(new Array(20).fill(3), 9))
 * 
 * const M = mult( df.get('M1'), df.get('M2') )
 * ```
*/

/**
 * Multiply series between them, item component  by item component.
 * Do not confuse with [[multMat]]
 * @see [[multMat]]
 * @example
 * Perform: `a = b * c` where b, c and d are vectors of size 3
 * ```ts
 * let df = DataFrame.create({
 *      series: {
 *          b: createSerie(new Array(20).fill(2), 3)),
 *          c: createSerie(new Array(20).fill(3), 3))
 *      }
 * })
 * 
 * const a = mult( df.series['b'], df.series['c'] )
 * ```
 * @example
 * Perform: `a = 0.1*b + 0.3*c + 0.7*d`
 * ```ts
 * let df = DataFrame.create({
 *      series: {
 *          b: createSerie(new Array(20).fill(2), 3)),
 *          c: createSerie(new Array(20).fill(3), 3)),
 *          c: createSerie(new Array(20).fill(4), 3))
 *      }
 * })
 * 
 * const a = add(
 *     mult( df.series['b'], 0.1),
 *     mult( df.series['c'], 0.3),
 *     mult( df.series['d'], 0.7)
 * )
 * ```
 * @category Dataframe
 */
export const mult = (s: Serie, ...args: (Serie|number)[]) => {
    if (s === undefined) return undefined
    if (!args) throw new Error('cannot multiply undefined to s')

    const r = s.clone()

    args.forEach (o => {
        if (typeof(o) === 'number') {
            r.array.forEach( (_,i) => r.array[i] *= o )
        }
        else {
            if (o.length !== s.length) {
                throw new Error(`size mistmatch. Cannot multiply 2 Series of different sizes (${o.length} != ${s.length})`)
            }
            o.array.forEach( (v,i) => r.array[i] *= v )
        }
    })

    return r
}
