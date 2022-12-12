import { mat, Quaternion } from '.'
import { vec } from './vectors'

/**
 * Rotate a vector
 * @param axis The axis of rotation
 * @param angle The angle of rotation
 * @param v The vector to rotate
 * @returns The rotated vector (new instance)
 */
export function rotateAxis(axis: vec.Vector3, angle: number, v: vec.Vector3) {
    const nor = vec.norm(axis)
    const q = [0, 0, 0, 1]
    if (nor > 1e-9) {
        const sha = Math.sin(angle * 0.5) / nor
        q[0] = sha * axis[0]
        q[1] = sha * axis[1]
        q[2] = sha * axis[2]
        q[3] = Math.cos(angle * 0.5)
    }
    const q00 = 2.0 * q[0] ** 2
    const q11 = 2.0 * q[1] ** 2
    const q22 = 2.0 * q[2] ** 2
    const q01 = 2.0 * q[0] * q[1]
    const q02 = 2.0 * q[0] * q[2]
    const q03 = 2.0 * q[0] * q[3]
    const q12 = 2.0 * q[1] * q[2]
    const q13 = 2.0 * q[1] * q[3]
    const q23 = 2.0 * q[2] * q[3]
    return [
        (1.0 - q11 - q22) * v[0] + (q01 - q23) * v[1] + (q02 + q13) * v[2],
        (q01 + q23) * v[0] + (1.0 - q22 - q00) * v[1] + (q12 - q03) * v[2],
        (q02 - q13) * v[0] + (q12 + q03) * v[1] + (1.0 - q11 - q00) * v[2],
    ]
}

/**
 * Get a 3D rotation matrix given an axis and an angle in degrees.
 * Axis can be either a vec.Vector3 or a string ('x', 'X', 'y', 'Y', 'z' or 'Z')
 * @param axis
 * @param angleInDeg
 * @returns [[mat.Matrix3]]
 */
export function getRotationAxis(
    axis: vec.Vector3 | string,
    angleInDeg: number,
): mat.Matrix3 {
    if (Array.isArray(axis)) {
        return Quaternion.fromAxisAngle(axis, angleInDeg).toMatrix()
    }

    let AXIS = 2
    if (axis === 'x' || axis === 'X') {
        AXIS = 0
    } else if (axis === 'y' || axis === 'Y') {
        AXIS = 1
    }

    const R = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ] as mat.Matrix3

    const c = Math.cos((angleInDeg * Math.PI) / 180.0)
    const s = Math.sin((angleInDeg * Math.PI) / 180.0)

    if (AXIS === 2) {
        R[0][0] = c
        R[0][1] = -s
        R[1][0] = s
        R[1][1] = c
        R[2][2] = 1
    } else if (AXIS === 0) {
        R[0][0] = 1
        R[1][1] = c
        R[1][2] = -s
        R[2][1] = s
        R[2][2] = c
    } else {
        R[0][0] = c
        R[0][2] = s
        R[2][0] = -s
        R[1][1] = 1
        R[2][2] = c
    }

    return R
}
