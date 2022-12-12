import { mat } from './matrix3'
import { vec } from './vectors'

const setRow = (m: mat.Matrix3, i: number, v: vec.Vector3) => {
    m[i][0] = v[0]
    m[i][1] = v[1]
    m[i][2] = v[2]
}

export class Quaternion {
    private q: Array<number> = [0, 0, 0, 1]

    /**
     *
     * @param {Vector3} axis Axis of ratation
     * @param {number} angle Angle of rotation in radian
     */
    static fromAxisAngle(axis: vec.Vector3, angle: number) {
        const q = new Quaternion()
        q.setAxisAngle(axis, angle)
        return q
    }

    // prod 2 quaternions
    static fromProd(a: Quaternion, b: Quaternion) {
        const q = new Quaternion()
        q.q[0] =
            a.q[3] * b.q[0] +
            b.q[3] * a.q[0] +
            a.q[1] * b.q[2] -
            a.q[2] * b.q[1]
        q.q[1] =
            a.q[3] * b.q[1] +
            b.q[3] * a.q[1] +
            a.q[2] * b.q[0] -
            a.q[0] * b.q[2]
        q.q[2] =
            a.q[3] * b.q[2] +
            b.q[3] * a.q[2] +
            a.q[0] * b.q[1] -
            a.q[1] * b.q[0]
        q.q[3] =
            a.q[3] * b.q[3] -
            b.q[0] * a.q[0] -
            a.q[1] * b.q[1] -
            a.q[2] * b.q[2]
        return q
    }

    // 3 Vec3
    static fromBase(X: vec.Vector3, Y: vec.Vector3, Z: vec.Vector3) {
        const q = new Quaternion()
        q.setFromBase(X, Y, Z)
        return q
    }

    // Mat3
    static fromRotationMatrix(r: mat.Matrix3) {
        const q = new Quaternion()
        q.setFromRotationMatrix(r)
        return q
    }

    // 2 Vec3
    static fromTo(from: vec.Vector3, to: vec.Vector3) {
        const q = new Quaternion()
        q.setFromTo(from, to)
        return q
    }

    // ------------------------------------

    get data() {
        return this.q
    }

    get axis(): vec.Vector3 {
        const res = [this.q[0], this.q[1], this.q[2]] as vec.Vector3
        const sinus = vec.norm(res)
        if (sinus > 1e-8) {
            vec.scale(res, 1 / sinus)
        }
        return Math.acos(this.q[3]) <= Math.PI / 2.0
            ? res
            : (vec.scale(res, -1) as vec.Vector3)
    }

    get angle() {
        const angle = 2.0 * Math.acos(this.q[3])
        return angle <= Math.PI ? angle : 2.0 * Math.PI - angle
    }

    // ------------------------------------

    equals(q: Quaternion) {
        for (let i = 0; i < 4; ++i) {
            if (this.q[i] !== q.q[i]) {
                return false
            }
        }
        return true
    }

    notEquals(q: Quaternion) {
        return !this.equals(q)
    }

    prod(q: Quaternion) {
        const r = Quaternion.fromProd(this, q)
        return this.setFrom(r)
    }

    inverse() {
        const q = new Quaternion()
        for (let i = 0; i < 3; ++i) {
            q.q[i] = -this.q[i]
        }
        q.q[3] = this.q[3]
        return q
    }

    invert() {
        this.q[0] *= -1
        this.q[1] *= -1
        this.q[2] *= -1
        return this
    }

    negate() {
        this.invert()
        this.q[3] *= -1
        return this
    }

    normalize() {
        const q = this.q
        const norm = Math.sqrt(
            q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3],
        )
        for (let i = 0; i < 4; ++i) {
            q[i] /= norm
        }
        return norm
    }

    // 2 quaternions
    dot(A: Quaternion, B: Quaternion) {
        const a = A.q
        const b = B.q
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
    }

    /**
     * Rorate inverse a vector
     * @param {Vec3} V The vector to inverse rotate
     * @returns {Vec3} The rotated vector
     */
    iRotate(v: vec.Vector3) {
        const q = this.q
        const q00 = 2.0 * q[0] * q[0]
        const q11 = 2.0 * q[1] * q[1]
        const q22 = 2.0 * q[2] * q[2]
        const q01 = 2.0 * q[0] * q[1]
        const q02 = 2.0 * q[0] * q[2]
        const q03 = 2.0 * q[0] * q[3]
        const q12 = 2.0 * q[1] * q[2]
        const q13 = 2.0 * q[1] * q[3]
        const q23 = 2.0 * q[2] * q[3]
        //const v = [V.x, V.y, V.z]
        return [
            (1.0 - q11 - q22) * v[0] + (q01 + q23) * v[1] + (q02 - q13) * v[2],
            (q01 - q23) * v[0] + (1.0 - q22 - q00) * v[1] + (q12 + q03) * v[2],
            (q02 + q13) * v[0] + (q12 - q03) * v[1] + (1.0 - q11 - q00) * v[2],
        ] as vec.Vector3
    }

    /**
     * Rotate a vector
     * @param {Vec3} v The vector to rotate
     * @returns {Vec3} The rotated vector
     */
    rotate(v: vec.Vector3) {
        const q = this.q
        const q00 = 2.0 * q[0] * q[0]
        const q11 = 2.0 * q[1] * q[1]
        const q22 = 2.0 * q[2] * q[2]
        const q01 = 2.0 * q[0] * q[1]
        const q02 = 2.0 * q[0] * q[2]
        const q03 = 2.0 * q[0] * q[3]
        const q12 = 2.0 * q[1] * q[2]
        const q13 = 2.0 * q[1] * q[3]
        const q23 = 2.0 * q[2] * q[3]
        //const v = [V.x, V.y, V.z]
        return [
            (1.0 - q11 - q22) * v[0] + (q01 - q23) * v[1] + (q02 + q13) * v[2],
            (q01 + q23) * v[0] + (1.0 - q22 - q00) * v[1] + (q12 - q03) * v[2],
            (q02 - q13) * v[0] + (q12 + q03) * v[1] + (1.0 - q11 - q00) * v[2],
        ]
    }

    // --------------------------------------------

    /**
     * @return [xx,xy,xz,yy,yz,zz] the rotation matrix (symm) (?? should be antisym)
     */
    toMatrix(): mat.Matrix3 {
        this.normalize()
        const q = this.q

        const M = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ] as mat.Matrix3

        // M[0] = 1 - 2 * q[1] ** 2 - 2 * q[2] ** 2
        // M[1] = 2 * q[0] * q[1] - 2 * q[2] * q[3]
        // M[2] = 2 * q[0] * q[2] + 2 * q[1] * q[3]
        // M[3] = 1 - 2 * q[0] ** 2 - 2 * q[2] ** 2
        // M[4] = 2 * q[1] * q[2] - 2 * q[0] * q[3]
        // M[5] = 1 - 2 * q[0] ** 2 - 2 * q[1] ** 2
        // return M

        const q0 = q[0]
        const q1 = q[1]
        const q2 = q[2]
        const q3 = q[3]

        // First row of the rotation matrix
        M[0][0] = 2 * (q0 * q0 + q1 * q1) - 1
        M[0][1] = 2 * (q1 * q2 - q0 * q3)
        M[0][2] = 2 * (q1 * q3 + q0 * q2)

        // Second row of the rotation matrix
        M[1][0] = 2 * (q1 * q2 + q0 * q3)
        M[1][1] = 2 * (q0 * q0 + q2 * q2) - 1
        M[1][2] = 2 * (q2 * q3 - q0 * q1)

        // Third row of the rotation matrix
        M[2][0] = 2 * (q1 * q3 - q0 * q2)
        M[2][1] = 2 * (q2 * q3 + q0 * q1)
        M[2][2] = 2 * (q0 * q0 + q3 * q3) - 1

        return M
    }

    setFrom(q: Quaternion) {
        for (let i = 0; i < 4; ++i) {
            this.q[i] = q.q[i]
        }
        return this
    }

    /**
     *
     * @param {Vec3} v The axis of rotation
     * @param {Number} angle
     */
    setAxisAngle(v: vec.Vector3, angle: number) {
        const nor = vec.norm(v)

        if (nor < 1e-9) {
            this.q[0] = 0.0
            this.q[1] = 0.0
            this.q[2] = 0.0
            this.q[3] = 1.0
        } else {
            const sha = Math.sin(angle / 2.0)
            this.q[0] = (sha * v[0]) / nor
            this.q[1] = (sha * v[1]) / nor
            this.q[2] = (sha * v[2]) / nor
            this.q[3] = Math.cos(angle / 2.0)
        }
        return this
    }

    setFromTo(from: vec.Vector3, to: vec.Vector3) {
        const epsilon = 1e-10
        const fromSqNorm = vec.norm2(from)
        const toSqNorm = vec.norm2(to)
        const axis = vec.cross(from, to)
        const axisSqNorm = vec.norm2(axis)
        const q = this.q
        const test = vec.dot(from, to) / Math.sqrt(fromSqNorm * toSqNorm)
        if (test < 0 && 1 - Math.abs(test) < epsilon) {
            q[0] = q[1] = q[2] = 0.0
            q[3] = 1.0
            return this
        }

        if (
            fromSqNorm < epsilon ||
            toSqNorm < epsilon ||
            axisSqNorm < epsilon
        ) {
            q[0] = q[1] = q[2] = 0.0
            q[3] = 1.0
        } else {
            let angle = Math.asin(Math.sqrt(axisSqNorm / fromSqNorm / toSqNorm))
            if (vec.dot(from, to) < 0.0) {
                angle = Math.PI - angle
            }
            this.setAxisAngle(axis, angle)
        }
        return this
    }

    /**
     *
     * @param {Mat3} r The roration matrix
     */
    setFromRotationMatrix(m: mat.Matrix3) {
        //const m = r.data
        let i = 2
        if (m[0][0] > m[1][1]) {
            if (m[0][0] > m[2][2]) {
                i = 0
            }
        } else {
            if (m[1][1] > m[2][2]) {
                i = 1
            }
        }
        if (m[0][0] + m[1][1] + m[2][2] > m[i][i]) {
            this.q[3] = Math.sqrt(m[0][0] + m[1][1] + m[2][2] + 1.0) / 2.0
            this.q[0] = (m[2][1] - m[1][2]) / (4.0 * this.q[3])
            this.q[1] = (m[0][2] - m[2][0]) / (4.0 * this.q[3])
            this.q[2] = (m[1][0] - m[0][1]) / (4.0 * this.q[3])
        } else {
            const j = (i + 1) % 3
            const k = (i + 2) % 3
            this.q[i] = Math.sqrt(m[i][i] - m[j][j] - m[k][k] + 1.0) / 2.0
            this.q[j] = (m[i][j] + m[j][i]) / (4.0 * this.q[i])
            this.q[k] = (m[i][k] + m[k][i]) / (4.0 * this.q[i])
            this.q[3] = (m[k][j] - m[j][k]) / (4.0 * this.q[i])
        }
        return this
    }

    setFromBase(X: vec.Vector3, Y: vec.Vector3, Z: vec.Vector3) {
        const m = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ] as mat.Matrix3
        const normX = vec.norm(X)
        const normY = vec.norm(Y)
        const normZ = vec.norm(Z)

        for (let i = 0; i < 3; ++i) {
            setRow(m, i, [X[i] / normX, Y[i] / normY, Z[i] / normZ])
        }
        return this.setFromRotationMatrix(m)
    }
}
