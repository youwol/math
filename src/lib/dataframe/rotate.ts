import { Serie } from '@youwol/dataframe'
import { multMat } from './multMat'
import { transpose } from './transpose'

/**
 * @category Dataframe
 */
export const rotate = (s: Serie, rot: Serie): Serie => {
    if (s  ===undefined) throw new Error ('s is undefined')
    if (rot===undefined) throw new Error ('rot is undefined')
    if (rot.itemSize !== 9) throw new Error ('rot should have itemSize=9')

    if (s.itemSize === 1) return s.clone()
    if (s.itemSize === 3) return multMat(rot, s)
    return multMat(rot, multMat(s, transpose(rot)))
}
