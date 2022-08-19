import { Serie }     from '@youwol/dataframe'
import { mat }       from '..'
import { multMat }   from './multMat'
import { transpose } from './transpose'

/**
 * @see [[getRotationAxis]] to generate a rotation matrix
 * @category Dataframe
 */
export const rotate = (s: Serie, rot: Serie | mat.Matrix3, inverse = false): Serie => {
    if (s  ===undefined) throw new Error ('s is undefined')
    if (rot===undefined) throw new Error ('rot is undefined')

    if (inverse) {
        if (Array.isArray(rot)) {
            if (s.itemSize === 1) return s.clone()
            if (s.itemSize === 3) {
                const R = mat.transpose(rot)
                return s.map( v => mat.multVec(R, v) )
            }
            if (s.itemSize === 9) {
                return s.map( m => mat.rotateInverse(mat.unpack(m), rot ) )
            }
            return s.map( m => mat.pack( mat.rotateInverse(mat.unpack(m), rot ), true ) )
        }
        else {
            if (rot.itemSize !== 9) throw new Error ('rot should have itemSize=9')
            if (s.itemSize === 1) return s.clone()
            if (s.itemSize === 3) return multMat(transpose(rot), s)
            return multMat(transpose(rot), multMat(s, rot))
        }
    }
    else {
        if (Array.isArray(rot)) {
            if (s.itemSize === 1) return s.clone()
            if (s.itemSize === 3) return s.map( v => mat.multVec(rot, v) )
            if (s.itemSize === 9) {
                return s.map( m => mat.rotateForward(mat.unpack(m), rot ) )
            }
            return s.map( m => mat.pack( mat.rotateForward(mat.unpack(m), rot ), true ) )
        }
        else {
            if (rot.itemSize !== 9) throw new Error ('rot should have itemSize=9')
            if (s.itemSize === 1) return s.clone()
            if (s.itemSize === 3) return multMat(rot, s)
            return multMat(rot, multMat(s, transpose(rot)))
        }
    }
}
