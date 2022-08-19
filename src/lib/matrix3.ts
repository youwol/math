import { getRotationAxis } from "./rotateAxis"
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

    export function multMat(m1: Matrix3, m2: Matrix3): Matrix3 {
        const t = [[0,0,0], [0,0,0], [0,0,0]] as Matrix3
        t[0][0] = m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0] 
        t[0][1] = m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1] 
        t[0][2] = m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2] 
        t[1][0] = m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0] 
        t[1][1] = m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1] 
        t[1][2] = m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2] 
        t[2][0] = m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0] 
        t[2][1] = m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1] 
        t[2][2] = m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2]
        return t
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

        return [
            [m[0][0], m[1][0], m[2][0]],
            [m[0][1], m[1][1], m[2][1]],
            [m[0][2], m[1][2], m[2][2]]
        ] as Matrix3
    }

    export function transposeSelf(m: Matrix3) {
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
        return rotateForward(m, getRotationAxis(AXIS, angleInDeg))
    }

    /**
     * Rotate inverse a [[Matrix3]] according to a rotation matrix
     * @param {Matrix3} R The rotation matrix (antisymmetric)
     * @param {Matrix3} M The matrix3 to rotate
     */
    export function rotateInverse(M: Matrix3, R: Matrix3) {        
        const Rt = transpose(R)
        return multMat( Rt, multMat(M, R) )
    }

    /**
     * Rotate forward a [[Matrix3]] according to a rotation matrix
     * @param {Matrix3} R The rotation matrix (antisymmetric)
     * @param {Matrix3} M The matrix3 to rotate
     */
    export function rotateForward(M: Matrix3, R: Matrix3) {
        const Rt = transpose(R)
        return multMat(R, multMat(M, Rt) )
    }

    export function makeRotationX(theta: number) {
		const c = Math.cos( theta*Math.PI/180 ), s = Math.sin( theta*Math.PI/180 )
		return unpack([1, 0,  0,
            0, c, -s,
            0, s,  c])
	}

	export function makeRotationY(theta: number) {
		const c = Math.cos( theta*Math.PI/180 ), s = Math.sin( theta*Math.PI/180 )
        return unpack([ c, 0, s,
            0, 1, 0,
            -s, 0, c])
	}

	export function makeRotationZ(theta: number) {
        const c = Math.cos( theta*Math.PI/180 ), s = Math.sin( theta*Math.PI/180 )
        return unpack([ c, -s, 0,
            s,  c, 0,
            0,  0, 1])
	}
}
