import { vec } from "./vectors"

const dot2  = (a:vec.Vector2, b: vec.Vector2): number => a.reduce( (acc, cur, i) => acc+cur*b[i])
const dot3  = (a:vec.Vector3, b: vec.Vector3): number => a.reduce( (acc, cur, i) => acc+cur*b[i])
const from2 = (a:vec.Vector2, b: vec.Vector2):vec.Vector2      => [b[0]-a[0], b[1]-a[1]]
const from3 = (a:vec.Vector3, b: vec.Vector3):vec.Vector3      => [b[0]-a[0], b[1]-a[1], b[2]-a[2]]

/**
 * @category Barycentric
 */
export function barycentric2(p: vec.Vector2, a: vec.Vector2, b: vec.Vector2, c: vec.Vector2): vec.Vector3 {
    const v0 = from2(a, b)
    const v1 = from2(a, c)
    const Vector2 = from2(a, p)
    const d00 = dot2(v0,v0)
    const d01 = dot2(v0,v1)
    const d11 = dot2(v1,v1)
    const d20 = dot2(Vector2,v0)
    const d21 = dot2(Vector2,v1)
    const denom = 1 / (d00 * d11 - d01 * d01)
    const v = (d11 * d20 - d01 * d21)*denom
    const w = (d00 * d21 - d01 * d20)*denom
    const u = 1 - v - w
    return [u, v, w]
}

/**
 * @category Barycentric
 */
export function barycentric3(p: vec.Vector3, a: vec.Vector3, b: vec.Vector3, c: vec.Vector3): vec.Vector3 {
    const v0 = from3(a, b)
    const v1 = from3(a, c)
    const Vector2 = from3(a, p)
    const d00 = dot3(v0,v0)
    const d01 = dot3(v0,v1)
    const d11 = dot3(v1,v1)
    const d20 = dot3(Vector2,v0)
    const d21 = dot3(Vector2,v1)
    const denom = 1 / (d00 * d11 - d01 * d01)
    const v = (d11 * d20 - d01 * d21)*denom
    const w = (d00 * d21 - d01 * d20)*denom
    const u = 1 - v - w
    return [u, v, w]
}

// from https://dennis2society.de/painless-tetrahedral-barycentric-mapping
/**
 * @category Barycentric
 */
export function barycentric4(p: vec.Vector3, p0: vec.Vector3, p1: vec.Vector3, p2: vec.Vector3, p3: vec.Vector3): vec.Vector4 {
    const trans = (p: vec.Vector3): vec.Vector4 => [p[0], p[1], p[2], 1]
    const v0 = trans(p0)
    const v1 = trans(p1)
    const Vector2 = trans(p2)
    const Vector3 = trans(p3)
    const P = trans(p)
    const det0 = determinant4x4(v0, v1, Vector2, Vector3)
    const det1 = determinant4x4(P, v1, Vector2, Vector3)
    const det2 = determinant4x4(v0, P, Vector2, Vector3)
    const det3 = determinant4x4(v0, v1, P, Vector3)
    const det4 = determinant4x4(v0, v1,Vector2, P)
    return [(det1/det0), (det2/det0), (det3/det0), (det4/det0)]
}





function determinant4x4(v0: vec.Vector4, v1: vec.Vector4, v2: vec.Vector4, v3: vec.Vector4): number {
    return  v0[3]*v1[2]*v2[1]*v3[0] - v0[2]*v1[3]*v2[1]*v3[0] -
            v0[3]*v1[1]*v2[2]*v3[0] + v0[1]*v1[3]*v2[2]*v3[0] +
            v0[2]*v1[1]*v2[3]*v3[0] - v0[1]*v1[2]*v2[3]*v3[0] -
            v0[3]*v1[2]*v2[0]*v3[1] + v0[2]*v1[3]*v2[0]*v3[1] +
            v0[3]*v1[0]*v2[2]*v3[1] - v0[0]*v1[3]*v2[2]*v3[1] -
            v0[2]*v1[0]*v2[3]*v3[1] + v0[0]*v1[2]*v2[3]*v3[1] +
            v0[3]*v1[1]*v2[0]*v3[2] - v0[1]*v1[3]*v2[0]*v3[2] -
            v0[3]*v1[0]*v2[1]*v3[2] + v0[0]*v1[3]*v2[1]*v3[2] +
            v0[1]*v1[0]*v2[3]*v3[2] - v0[0]*v1[1]*v2[3]*v3[2] -
            v0[2]*v1[1]*v2[0]*v3[3] + v0[1]*v1[2]*v2[0]*v3[3] +
            v0[2]*v1[0]*v2[1]*v3[3] - v0[0]*v1[2]*v2[1]*v3[3] -
            v0[1]*v1[0]*v2[2]*v3[3] + v0[0]*v1[1]*v2[2]*v3[3]
}
