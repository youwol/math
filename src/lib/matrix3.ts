import { vec } from "./vectors"

export namespace mat {

    /**
     * @category Matrix
     */
    export type Matrix3 = [vec.Vector3, vec.Vector3, vec.Vector3]

    /**
     * Unpack a linearized matrix (components in a vector) and return
     * a double array matrix
     * @example
     * ```ts
     * // sym matrix3
     * const m = [1, 2, 3, 
     *               4, 5, 
     *                  6]
     * const n = unpack(m)
     * // will give
     * // [
     * //   [1, 2, 3],
     * //   [2, 4, 5],
     * //   [3, 5, 6]
     * // ]
     * ```
     */
    export function unpack(m: vec.Vector6 | vec.Vector9): Matrix3 {
        if (m.length === 6) {
            return [
                [m[0], m[1], m[2]],
                [m[1], m[3], m[4]],
                [m[2], m[4], m[5]]
            ]
        }
        return [
            [m[0], m[1], m[2]],
            [m[3], m[4], m[5]],
            [m[6], m[7], m[8]]
        ]
    }

    /**
     * Pack a a double array matrix, i.e. return
     * components in a vector
     * @see [[unpack]]
     */
    export function pack(m: Matrix3, isSym = true): vec.Vector6 | vec.Vector9 {
        if (isSym) {
            return [
                m[0][0], m[0][1], m[0][2], 
                         m[1][1], m[1][2], 
                                  m[2][2]
            ]
        }
        return [
            m[0][0], m[0][1], m[0][2], 
            m[1][0], m[1][1], m[1][2], 
            m[2][0], m[2][1], m[2][2]
        ]
    }

    /**
     * @category Matrix
     */
    export function det(m: Matrix3) {
        return m[0][0] * m[1][1] * m[2][2] - 
            m[0][0] * m[1][2] * m[2][1] - 
            m[0][1] * m[1][0] * m[2][2] + 
            m[0][1] * m[1][2] * m[2][0] + 
            m[0][2] * m[1][0] * m[2][1] - 
            m[0][2] * m[1][1] * m[2][0]
    }

    export function multVec(e: Matrix3, v: vec.Vector3): vec.Vector3 {
        const x = v[0], y = v[1], z = v[2]
        return [
            e[0][0] * x + e[0][1] * y + e[0][2] * z,
            e[1][0] * x + e[1][1] * y + e[1][2] * z,
            e[2][0] * x + e[2][1] * y + e[2][2] * z]
    }

    export function multTVec(e: Matrix3, v: vec.Vector3): vec.Vector3 {
        const x = v[0], y = v[1], z = v[2]
        return [
            e[0][0] * x + e[1][0] * y + e[2][0] * z,
            e[0][1] * x + e[1][1] * y + e[2][1] * z,
            e[0][2] * x + e[1][2] * y + e[2][2] * z]
    }

    /**
     * @category Matrix
     */
    export function inv(me: Matrix3, throwOnDegenerate: boolean) {
        var n11 = me[0][0], n21 = me[0][1], n31 = me[0][2],
            n12 = me[1][0], n22 = me[1][1], n32 = me[1][2],
            n13 = me[2][0], n23 = me[2][1], n33 = me[2][2],
            t11 = n33 * n22 - n32 * n23,
            t12 = n32 * n13 - n33 * n12,
            t13 = n23 * n12 - n22 * n13,
            det = n11 * t11 + n21 * t12 + n31 * t13

        if (det === 0) {
            let msg = "Matrix3: .getInverse() can't invert matrix, determinant is 0"
            if (throwOnDegenerate === true) {
                throw new Error(msg)
            } else {
                console.warn(msg)
            }
            return this.identity()
        }

        let detInv = 1 / det
        return [
            [t11 * detInv, (n31 * n23 - n33 * n21) * detInv, (n32 * n21 - n31 * n22) * detInv],
            [t12 * detInv, (n33 * n11 - n31 * n13) * detInv, (n31 * n12 - n32 * n11) * detInv],
            [t13 * detInv, (n21 * n13 - n23 * n11) * detInv, (n22 * n11 - n21 * n12) * detInv]
        ]
    }

    /**
     * @category Matrix
     */
    export function transpose(m: Matrix3) {
        let tmp: number

        tmp = m[0][1]; m[0][1] = m[1][0]; m[1][0] = tmp
        tmp = m[0][2]; m[0][2] = m[2][0]; m[2][0] = tmp
        tmp = m[1][2]; m[1][2] = m[2][1]; m[2][1] = tmp

        return this
    }

    /**
     * @brief Rotate CCW (angle in degrees) along the provided axis.
     * @param m The matrix
     * @param angleInDeg The angle of rotation
     * @param AXIS The axis of rotation/ Can be either `x`, `X`, `y`, `Y`, `z`, or `Z`.
     * @category Matrix
     */
    export function rotate(m: Matrix3, angleInDeg: number, AXIS: string) {
        let axis = 2 ;

        if (AXIS === 'x' || AXIS === 'X') {
            axis = 0
        } else if (AXIS === 'y' || AXIS === 'Y') {
            axis = 1
        }

        const R = [[0,0,0], [0,0,0], [0,0,0]] as Matrix3
        const c = Math.cos(angleInDeg * Math.PI / 180.0)
        const s = Math.sin(angleInDeg * Math.PI / 180.0)

        if (axis === 2) {
            R[0][0] = c ;
            R[0][1] = -s ;
            R[1][0] = s ;
            R[1][1] = c ;
            R[2][2] = 1 ;
        } else if (axis === 0) {
            R[0][0] = 1 ;
            R[1][1] = c ;
            R[1][2] = -s ;
            R[2][1] = s ;
            R[2][2] = c ;
        } else {
            R[0][0] = c ;
            R[0][2] = s ;
            R[2][0] = -s ;
            R[1][1] = 1 ;
            R[2][2] = c ;
        }

        return rotateInverse(m, R)
    }

    /**
     * Rotate inverse a [[Matrix3]] according to a rotation matrix
     * @param {Matrix3} rot The rotation matrix (antisymmetric)
     * @param {Matrix3} m The matrix3 to rotate
     */
    export function rotateInverse(m: Matrix3, rot: Matrix3) {
        const t = [[0,0,0], [0,0,0], [0,0,0]] as Matrix3
        t[0][0] = m[0][0] * rot[0][0] + m[0][1] * rot[1][0] + m[0][2] * rot[2][0] 
        t[0][1] = m[0][0] * rot[0][1] + m[0][1] * rot[1][1] + m[0][2] * rot[2][1] 
        t[0][2] = m[0][0] * rot[0][2] + m[0][1] * rot[1][2] + m[0][2] * rot[2][2] 
        t[1][0] = m[1][0] * rot[0][0] + m[1][1] * rot[1][0] + m[1][2] * rot[2][0] 
        t[1][1] = m[1][0] * rot[0][1] + m[1][1] * rot[1][1] + m[1][2] * rot[2][1] 
        t[1][2] = m[1][0] * rot[0][2] + m[1][1] * rot[1][2] + m[1][2] * rot[2][2] 
        t[2][0] = m[2][0] * rot[0][0] + m[2][1] * rot[1][0] + m[2][2] * rot[2][0] 
        t[2][1] = m[2][0] * rot[0][1] + m[2][1] * rot[1][1] + m[2][2] * rot[2][1] 
        t[2][2] = m[2][0] * rot[0][2] + m[2][1] * rot[1][2] + m[2][2] * rot[2][2] 
        // Operates: rot'.t
        const s = [[0,0,0], [0,0,0], [0,0,0]] as Matrix3
        s[0][0] = rot[0][0] * t[0][0] + rot[1][0] * t[1][0] + rot[2][0] * t[2][0] 
        s[0][1] = rot[0][0] * t[0][1] + rot[1][0] * t[1][1] + rot[2][0] * t[2][1] 
        s[0][2] = rot[0][0] * t[0][2] + rot[1][0] * t[1][2] + rot[2][0] * t[2][2] 
        s[1][0] = rot[0][1] * t[0][0] + rot[1][1] * t[1][0] + rot[2][1] * t[2][0] 
        s[1][1] = rot[0][1] * t[0][1] + rot[1][1] * t[1][1] + rot[2][1] * t[2][1] 
        s[1][2] = rot[0][1] * t[0][2] + rot[1][1] * t[1][2] + rot[2][1] * t[2][2] 
        s[2][0] = rot[0][2] * t[0][0] + rot[1][2] * t[1][0] + rot[2][2] * t[2][0] 
        s[2][1] = rot[0][2] * t[0][1] + rot[1][2] * t[1][1] + rot[2][2] * t[2][1] 
        s[2][2] = rot[0][2] * t[0][2] + rot[1][2] * t[1][2] + rot[2][2] * t[2][2] 
        return s
    }

    /**
     * Rotate forward a [[Matrix3]] according to a rotation matrix
     * @param {Matrix3} rot The rotation matrix (antisymmetric)
     * @param {Matrix3} m The matrix3 to rotate
     */
    export function rotateForward(m: Matrix3, rot: Matrix3) {
        // Operates: t = s.rot'
        const t = [[0,0,0], [0,0,0], [0,0,0]] as Matrix3
        t[0][0] = m[0][0] * rot[0][0] + m[0][1] * rot[0][1] + m[0][2] * rot[0][2] 
        t[0][1] = m[0][0] * rot[1][0] + m[0][1] * rot[1][1] + m[0][2] * rot[1][2] 
        t[0][2] = m[0][0] * rot[2][0] + m[0][1] * rot[2][1] + m[0][2] * rot[2][2] 
        t[1][0] = m[1][0] * rot[0][0] + m[1][1] * rot[0][1] + m[1][2] * rot[0][2] 
        t[1][1] = m[1][0] * rot[1][0] + m[1][1] * rot[1][1] + m[1][2] * rot[1][2] 
        t[1][2] = m[1][0] * rot[2][0] + m[1][1] * rot[2][1] + m[1][2] * rot[2][2] 
        t[2][0] = m[2][0] * rot[0][0] + m[2][1] * rot[0][1] + m[2][2] * rot[0][2] 
        t[2][1] = m[2][0] * rot[1][0] + m[2][1] * rot[1][1] + m[2][2] * rot[1][2] 
        t[2][2] = m[2][0] * rot[2][0] + m[2][1] * rot[2][1] + m[2][2] * rot[2][2] 
        // Operates: rot.t
        const s = [[0,0,0], [0,0,0], [0,0,0]] as Matrix3
        s[0][0] = rot[0][0] * t[0][0] + rot[0][1] * t[1][0] + rot[0][2] * t[2][0] 
        s[0][1] = rot[0][0] * t[0][1] + rot[0][1] * t[1][1] + rot[0][2] * t[2][1] 
        s[0][2] = rot[0][0] * t[0][2] + rot[0][1] * t[1][2] + rot[0][2] * t[2][2] 
        s[1][0] = rot[1][0] * t[0][0] + rot[1][1] * t[1][0] + rot[1][2] * t[2][0] 
        s[1][1] = rot[1][0] * t[0][1] + rot[1][1] * t[1][1] + rot[1][2] * t[2][1] 
        s[1][2] = rot[1][0] * t[0][2] + rot[1][1] * t[1][2] + rot[1][2] * t[2][2] 
        s[2][0] = rot[2][0] * t[0][0] + rot[2][1] * t[1][0] + rot[2][2] * t[2][0] 
        s[2][1] = rot[2][0] * t[0][1] + rot[2][1] * t[1][1] + rot[2][2] * t[2][1] 
        s[2][2] = rot[2][0] * t[0][2] + rot[2][1] * t[1][2] + rot[2][2] * t[2][2] 
        return s
    }
}