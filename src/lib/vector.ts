interface IVector {
    [i: number]: number
    reduce(cb: Function, init: number): any
    map(cb: Function): IVector
}
/**
 * @category Vector
 */
export type Vector2 = [number,number]

/**
 * @category Vector
 */
export type Vector3 = [number,number,number]

/**
 * @category Vector
 */
 export type Vector4 = [number,number,number,number]



/**
 * @category Vector
 */
export const norm2  = (v: IVector) => v.reduce( (acc,w) => acc+w**2, 0)

/**
 * @category Vector
 */
export const norm   = (v: IVector) => Math.sqrt( norm2(v) )

/**
 * @category Vector
 */
export const scale  = (v: IVector, s: number) => v.map( w => w*s )

/**
 * @category Vector
 */
export const dot    = (a:IVector, b: IVector): number => a.reduce( (acc, cur, i) => acc+cur*b[i], 0)

/**
 * @category Vector
 */
export const cross  = (v: Vector3, w: Vector3): Vector3 => {
    let x = v[1] * w[2] - v[2] * w[1]
    let y = v[2] * w[0] - v[0] * w[2]
    let z = v[0] * w[1] - v[1] * w[0]
    return [x, y, z]
}
