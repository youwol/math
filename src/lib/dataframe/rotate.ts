import { Serie }     from '@youwol/dataframe'
import { mat }       from '..'
import { multMat }   from './multMat'
import { transpose } from './transpose'

/**
 * @see [[getRotationAxis]] to generate a rotation matrix
 * @category Dataframe
 */
export const rotate = (s: Serie, rot: Serie | mat.Matrix3): Serie => {
    if (s  ===undefined) throw new Error ('s is undefined')
    if (rot===undefined) throw new Error ('rot is undefined')

    if (Array.isArray(rot)) {
        if (s.itemSize === 1) return s.clone()
        if (s.itemSize === 3) return s.map( v => mat.multVec(rot, v) )
        return s.map( m => mat.rotateInverse(rot, mat.unpack(m) ) )
    }
    else {
        if (rot.itemSize !== 9) throw new Error ('rot should have itemSize=9')
        if (s.itemSize === 1) return s.clone()
        if (s.itemSize === 3) return multMat(rot, s)
        return multMat(rot, multMat(s, transpose(rot)))
    }
}
