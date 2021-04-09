import { barycentric2, barycentric3, barycentric4 } from "./barycentric"
import { minMaxArray, scaleArray } from "./arrays"

type V2 = [number, number]
type V3 = [number, number, number]

/**
 * 
 * @param x Where to evaluate
 * @param x1 min point
 * @param x2 max point
 * @param q00 scalar value at x1
 * @param q01 scalar value at x2
 * @category Interpolation
 */
export function lerp(x: number, x1: number, x2: number, q00: number, q01: number) {
    const d = 1/(x2 - x1)
    return q00*(x2 - x)*d + q01*(x - x1)*d
}

/**
 * Bilinear interpolation
 * @param p Where to evaluate
 * @param p1 min point
 * @param p2 max point
 * @param q11 scalar value at (x1, y1)
 * @param q12 scalar value at (x1, y2)
 * @param q21 scalar value at (x2, y1)
 * @param q22 scalar value at (x2, y2)
 * @category Interpolation
 */
export function biLerp(p: V2, p1: V2, p2: V2, q11: number, q12: number, q21: number, q22: number) {
    const r1 = lerp(p[0], p1[0], p2[0], q11, q21)
    const r2 = lerp(p[0], p1[0], p2[0], q12, q22)
    return lerp(p[1], p1[1], p2[1], r1, r2)
}

/**
 * Trilinear interpolation
 * @param p Where to evaluate
 * @param p1 min point
 * @param p2 max point
 * @param q000 scalar value at (0,0,0)
 * @param q001 scalar value at (0,0,1)
 * @param q010 scalar value at (0,1,0)
 * @param q011 scalar value at (0,1,1)
 * @param q100 scalar value at (1,0,0)
 * @param q101 scalar value at (1,0,1)
 * @param q110 scalar value at (1,1,0)
 * @param q111 scalar value at (1,1,1)
 * @category Interpolation
 */
export function triLerp(p: V3, p1: V3, p2: V3, q000: number, q001: number, q010: number, q011: number, q100: number, q101: number, q110: number, q111: number) {
    const x00 = lerp(p[0], p1[0], p2[0], q000, q100)
    const x10 = lerp(p[0], p1[0], p2[0], q010, q110)
    const x01 = lerp(p[0], p1[0], p2[0], q001, q101)
    const x11 = lerp(p[0], p1[0], p2[0], q011, q111)
    const r0  = lerp(p[1], p1[1], p2[1], x00, x01)
    const r1  = lerp(p[1], p1[1], p2[1], x10, x11)
    return lerp(p[2], p1[2], p2[2], r0, r1)
}

/**
 * @param q1 Either a number or an array of size 3, 6 or 9 defined at point p1
 * @param q2 Either a number or an array of size 3, 6 or 9 defined at point p2
 * @param q3 Either a number or an array of size 3, 6 or 9 defined at point p3
 * @category Interpolation
 */
export function triangleLerp2D(p: V2, p1: V2, p2: V2, p3: V2, q1: any, q2: any, q3: any): any {
    const uvw = barycentric2(p, p1, p2, p3)
    if (Array.isArray(q1)) {
        return q1.map( (v1, i) => v1*uvw[0] + q2[i]*uvw[1] + q3[i]*uvw[2] )
    }
    return uvw[0]*q1 + uvw[1]*q2 + uvw[2]*q3
}

/**
 * @param q1 Either a number or an array of size 3, 6 or 9 defined at point p1
 * @param q2 Either a number or an array of size 3, 6 or 9 defined at point p2
 * @param q3 Either a number or an array of size 3, 6 or 9 defined at point p3
 * @category Interpolation
 */
export function triangleLerp3D(p: V3, p1: V3, p2: V3, p3: V3, q1: any, q2: any, q3: any): any {
    const uvw = barycentric3(p, p1, p2, p3)
    if (Array.isArray(q1)) {
        return q1.map( (v1, i) => v1*uvw[0] + q2[i]*uvw[1] + q3[i]*uvw[2] )
    }
    return uvw[0]*q1 + uvw[1]*q2 + uvw[2]*q3
}

/**
 * @param q1 Either a number or an array of size 3, 6 or 9 defined at point p1
 * @param q2 Either a number or an array of size 3, 6 or 9 defined at point p2
 * @param q3 Either a number or an array of size 3, 6 or 9 defined at point p3
 * @param q4 Either a number or an array of size 3, 6 or 9 defined at point p4
 * @category Interpolation
 */
export function tetraLerp(p: V3, p1: V3, p2: V3, p3: V3, p4: V3, q1: any, q2: any, q3: any, q4: any): any {
    const uvw = barycentric4(p, p1, p2, p3, p4)
    if (Array.isArray(q1)) {
        return q1.map( (v1, i) => v1*uvw[0] + q2[i]*uvw[1] + q3[i]*uvw[2] + q4[i]*uvw[3] )
    }
    return uvw[0]*q1 + uvw[1]*q2 + uvw[2]*q3 + uvw[3]*q4
}



// -------------------------------------------------------------------------
// INTERPOLATION multiple values using Topological information on a mesh
// -------------------------------------------------------------------------

/**
 * The direction for function [[meshInterpolate]]
 * @category Interpolation
 */
export enum InterpolateDirection {
    INCREASING,
    DECREASING
}

/**
 * Convert an attribute defined at combel of dim A to
 * a new attribute defined at a combel of dim B using a topological relationship.
 * If A<B, the direction is INCREASING (A -> B).
 * 
 * A combel made of 1 vertex (also called node) is of dim 0 (0-dimensional space).
 * 
 * A combel made of 2 connected vertices is a segment and is of dim 1 (1-dimensional space or line).
 * 
 * A combel made of 3 or more connected planar vertices (convex polygon) is of dim 2 (2-dimensional space or surface).
 * 
 * A combel made of 4 or more non-planar connected vertices is a tetrahedron and is of dim 3 (3-dimensional space or voluime).
 * 
 * @param attribute The starting attribute (combel A). An attribute can be an array of number or
 * an array of array of number (). For example:
 * <ul>
 * <li> scalar  : [0, 0, 0 ...]
 * <li> vector2 : [[0,0], [0,0] ...]
 * <li> vector3 : [[0,0,0], [0,0,0] ...]
 * <li> smatrix3: [[0,0,0,0,0,0], [0,0,0,0,0,0] ...] symetric 3x3 matrices
 * <li> matrix3 : [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0] ...] full 3x3 matrices
 * <li> Any Array<Array<number>>
 * </ul>
 * The return attribute is noted combel B.
 * @param topology The topological relationship bitween the underlaying combels A and B.
 * Topology is given as an array of arrays or an array of number (example: [[0,1,2], [0,2,6], [10,34], [1,8,9,4]...]).
 * For the later (array of number) you can provide the chunk size (default 3 for 3 nodes therefore for triangles)
 * of the combels.
 * @param size The chunk size of topology if an array of number is provided. Default value is 3
 * @param direction The direction of the interpolation. INCREASING direction means from combels
 * of lower to higher degree (e.g., from vertex to triangle or to segment or to tetrahedron or to ...).
 * DECREASING direction means from combels of higher to lower degree (e.g., from triangle to vertex).
 * Default value is INCREASING direction
 * @returns The new interpolated attribute for the underlaying combels defined in topology
 * @note We only interpolate from combel of dim 0 (vertex) to dim N, and from dim N to dim 0,
 * never from dim N to dim M.
 * @example
 * ```js
 * // interpolate node attributes to 2 triangles and 1 segment
 * // The first triangle is made of nodes index 0, 2 and 1
 * // The second triangle is made of nodes index 0, 3 and 2
 * // The segment is made of nodes index 2 and 3
 * const nodes    = [1.2, 5.9, 4.2, 7.2]
 * const topology = [[0,2,1], [0,3,2], [2,3]] // 2 triangles and 1 segment
 * const result   = interpolate({attribute: nodes, topology, direction: Direction.INCREASING})
 * // Return the value for the first and second triangle and the segment
 * // Expected return values [3.7666, 4.2, 6.2]
 * //   3.7666 = (1.2 + 4.2 + 5.9) / 3
 * //   4.2    = (1.2 + 7.2 + 4.2) / 3
 * //   6.2    = (4.2 + 7.2) / 2
 * ```
 * @category Interpolation
 */
export function meshInterpolate({ attribute, topology, size=3, direction = InterpolateDirection.INCREASING}:
    {
        attribute : Array<any>, 
        topology  : Array<any>,
        size?: number,
        direction?: InterpolateDirection
    }): Array<any>
{
    let topo = undefined
    if (attribute === undefined) {
        console.warn('Cannot meshInterpolate, attribute is undefined')
        return undefined
    }
    if (attribute.length === 0) {
        console.warn('Cannot meshInterpolate, attribute is empty')
        return undefined
    }
    if (topology === undefined) {
        console.warn('Cannot meshInterpolate, attribute is topology')
        return undefined
    }
    if (topology.length === 0) {
        console.warn('Cannot meshInterpolate, topology is empty')
        return undefined
    }

    if (typeof topology[0] === 'number') {
        // Humm, better to use [[], []...]
        // Have to use size to know the chunk size in topology
        topo = []
        if (topology.length % size !== 0) {
            throw new Error(`Cannot meshInterpolate, topology (of size ${topology.length}) is not divisable by ${size}`)
        }
        for (let i=0; i<topology.length; i+= size) {
            const a: Array<number> = []
            for (let j=0; j<size; ++j) {
                a.push(topology[i+j])
            }
            topo.push(a)
        }
    } else {
        topo = topology
    }

    switch(direction) {
        case InterpolateDirection.INCREASING: return interpolateIncreasingCombels({from: attribute, topology: topo})
        case InterpolateDirection.DECREASING: return interpolateDecreasingCombels({from: attribute, topology: topo})
    }
}






// P R I V A T E  starting from here


function getMinMax(topology: Array<Array<number>>) {
    const minMax = [Infinity, -Infinity]
    topology.forEach( combel => {
        const m = minMaxArray(combel)
        minMax[0] = Math.min(minMax[0], m[0])
        minMax[1] = Math.max(minMax[1], m[1])
    })
    return minMax
}

function interpolateIncreasingCombels(
    {from, topology}:
    {
        from     : Array<any>,
        topology : Array<Array<number>>
    }): Array<any>
{
    let minMax = getMinMax(topology)
    if (minMax[0]<0) {
        throw new Error(`Topology contains negatif indices`)
    }

    let a = from[0]
    if ( !(typeof a === 'number')) {
        a = a.slice().fill(0)
    } else {
        a = 0
    }

    const to = new Array(topology.length).fill(a)

    if (typeof a === 'number') {
        topology.forEach( (combel, index) => {
            to[index] = (combel.reduce( (v, i) => v + from[i]))/combel.length
        })
    }
    else {
        topology.forEach( (combel, index) => {
            let sum = a.slice()
            combel.forEach( index => {
                const b = from[index]
                sum = sum.map( (num:number, idx: number) => num + b[idx] )
            })
            to[index] = scaleArray(sum, 1/combel.length)
        })
    }

    return to
}

function interpolateDecreasingCombels(
    {from, topology}:
    {
        from     : Array<any>, 
        topology : Array<Array<number>>
    }): Array<any>
{
    let minMax = getMinMax(topology)

    //const minMax = topology.reduce( combel => minMaxArray(combel) )
    if (minMax[0]<0) {
        throw new Error(`Topology contains negatif indices`)
    }

    let a = from[0]
    let size = 1
    let to: Array<any> = undefined
    if ( !(typeof a === 'number')) {
        a = a.slice().fill(0)
        size = a.length
        to = new Array(minMax[1]+1).fill(undefined).map(_ => a.slice())
    } else {
        a = 0
        to = new Array(minMax[1]+1).fill(0)
    }

    const nbr = new Array(to.length).fill(0)

    if (typeof a === 'number') {
        topology.forEach( (idNodes, idFace) => {
            const v = from[idFace]
            idNodes.forEach( id => {
                to[id] += v
                nbr[id]++
            })
        })
        for (let i=0; i<to.length; ++i) {
            to[i] /= nbr[i]
        }
    } else {
        //console.log(to)
        topology.forEach( (idNodes, idFace) => {
            const v = from[idFace]
            idNodes.forEach( id => {
                const vv = to[id]
                for (let i=0; i<size; ++i) vv[i] += v[i]
                nbr[id]++
                //console.log(id, to)
            })
        })
        for (let j=0; j<to.length; ++j) {
            for (let i=0; i<size; ++i) to[j][i] /= nbr[j]
        }
        //console.log(to)
    }

    return to
}