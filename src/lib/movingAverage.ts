import { DataFrame, forEach, Serie } from '@youwol/dataframe'

/**
 * @param df The DataFrame supporting the data for which the we want ti apply this algorithm. This dataframe
 * must contains at least 2 series: `positions` and `name`, i.e., the following must hold:
 * ```js
 * df.series.positions // must exist
 * df.series[name]     // must exist
 * ```
 * 
 * @param x The origin in x
 * @param y The origin in y
 * @param z The origin in z
 * @param lx The width of the moving window 
 * @param ly The height of the moving window
 * @param Lx The width of the zone of interest 
 * @param ly The height of the zone of interest
 * @param nx The number of points along the x axis
 * @param ny The number of points along the y axis
 * @param name The name of the attribute to create
 * @return An object contaning the following
 * ```ts
 * {
 *      nx       : number, // nb points along x
 *      ny       : number, // nb points along y
 *      positions: Serie,  // itemSize = 3
 *      solution : serie   // itemSize = 1
 * }
 * ```
 * 
 * ```text
 *   Lx
 * --------------------------
 * |                        |
 * |                        |
 * |   lx                   | Ly
 * | -----                  |
 * | |   | ly               |
 * | -----                  |
 * o-------------------------
 * (x,y)
 * ```
 */
export function movingAverage(
    df: DataFrame,
    {x=0, y=0, z=0, lx, Lx, ly, Ly, nx, ny, name}:
    {x?: number, y?: number, z?: number, lx: number, ly: number, Lx: number, Ly: number, nx: number, ny: number, name: string})
{
    const dx = Lx / (nx-1)
    const dy = Ly / (ny-1)

    const p = df.series.positions // positions
    const a = df.series[name]     // attribute

    if (p === undefined) {throw new Error(`positions is undefined`)}
    if (a === undefined) {throw new Error(`attribute named ${name} is undefined`)}
    // if (a.itemSize !== 1) throw new Error(`attribute named ${name} must have itemSize=1 (at least for now)`)

    const bbox = new BBox(lx, ly)

    const result    = []
    const positions = []

    for (let i=0; i<nx; ++i) {
        bbox.x = x + i*dx
        for (let j=0; j<ny; ++j) {
            bbox.y = y + j*dy
            positions.push(bbox.x, bbox.y, z)
            result.push( bbox.density(p, a) )
        }
    }

    return {
        nx,
        ny,
        positions: Serie.create({array: positions, itemSize: 3}),
        solution : Serie.create({array: result   , itemSize: a.itemSize})
    }
}

// ---------------------------------------------------------------------

class BBox {
    public x = 0
    public y = 0

    constructor(private w: number, private h: number) {
    }

    contains(p: [number,number,number]): boolean {
        return p[0]>=this.x && p[1]>=this.y && p[0]<=this.x+this.w && p[1]<=this.y+this.h
    }

    density(serie: Serie, prop: Serie): number | number[] {
        let n = 0

        let a = undefined
        if (prop.itemSize === 1) {
            a = 0
        }
        else {
            a = new Array(prop.itemSize).fill(0)
        }

        forEach([serie, prop], ([s, p]) => {
            
            if (this.contains(s)) {
                n++
                if (prop.itemSize === 1) {
                    a += p as number
                }
                else {
                    for (let i=0; i<prop.itemSize; ++i) {
                        a[i] += p[i]
                    }
                }
            }
        })

        if (prop.itemSize === 1) {
            return (n===0 ? 0 : a/n)
        }
        else {
            if (n===0) {
                return a
            }
            else {
                return a.map( v => v/n)
            }
        }
    }
}
