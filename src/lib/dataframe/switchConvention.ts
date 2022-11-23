import { Serie } from '@youwol/dataframe'

/**
 * Convert a 2D or 3D stress tensor (symmetric tensors in the form [xx,xy,yy] or [xx,xy,xz,yy,yz,zz])
 * given in engineer, into geologist convention (or the other way around).
 * Two calls give the initial serie.
 * @example
 * ```ts
 * let stress = ... // stress in engineer convention
 * stress = switchConvention(stress) // stress in geologist convention
 * stress = switchConvention(stress) // stress in engineer convention
 * ```
 * @category Dataframe
 */
export const switchConvention = (s: Serie) => {
    if (s===undefined)    throw new Error ('series is undefined')
    if (s.itemSize!==6 && s.itemSize!==3) throw new Error('Series does not have itemSize = 3 or 6 (symmetric tensor [xx,xy,yy] or [xx,xy,xz,yy,yz,zz])')

    return s.map( stress => {
        return stress.map( v => -v )
    })
}
