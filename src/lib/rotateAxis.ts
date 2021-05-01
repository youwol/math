import { norm, Vector3 } from "./vectors"

/**
 * Rotate a vector 
 * @param axis The axis of rotation
 * @param angle The angle of rotation
 * @param v The vector to rotate
 * @returns The rotated vector (new instance)
 */
 export function rotateAxis(axis: Vector3, angle: number, v: Vector3) {
    const nor = norm(axis)
    const q = [0,0,0,1]
    if (nor > 1e-9) {
        const sha = Math.sin(angle*0.5)/nor
        q[0] = sha*axis[0]
        q[1] = sha*axis[1]
        q[2] = sha*axis[2]
        q[3] = Math.cos(angle*0.5)
    }
    const q00 = 2.0 * q[0]**2
    const q11 = 2.0 * q[1]**2
    const q22 = 2.0 * q[2]**2
    const q01 = 2.0 * q[0] * q[1]
    const q02 = 2.0 * q[0] * q[2]
    const q03 = 2.0 * q[0] * q[3]
    const q12 = 2.0 * q[1] * q[2]
    const q13 = 2.0 * q[1] * q[3]
    const q23 = 2.0 * q[2] * q[3]
    return [
        (1.0 - q11 - q22) * v[0] + (q01 - q23)       * v[1] + (q02 + q13)       * v[2],
        (q01 + q23)       * v[0] + (1.0 - q22 - q00) * v[1] + (q12 - q03)       * v[2],
        (q02 - q13)       * v[0] + (q12 + q03)       * v[1] + (1.0 - q11 - q00) * v[2]
    ]
}