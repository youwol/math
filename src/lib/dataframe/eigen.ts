import { Serie } from '@youwol/dataframe'
import { eigen } from '../'

/**
 * Get eigen values
 * @category Dataframe
 */
export const eigenValue = (s: Serie) => {
    if (s===undefined)    throw new Error ('series is undefined')

    let dim = s.dimension
    if (s.dimension===2 && (s.itemSize === 3 || s.itemSize===4)) {}
    else if (s.dimension===3 && (s.itemSize === 6 || s.itemSize===9)) {}
    else {
        throw new Error(`Series does not have itemSize = 3, 4, 6 or 9 ([xx,xy,yy], [xx,xy,xz,yy,yz,zz], [xx, xy, yx, yy] or [xx,xy,xz,yx,yy,yz,zx,zy,zz]). Got ${s.itemSize}`)
    }

    const r     = s.image(s.count, dim)
    const count = s.count
    let k       = 0

    for (let i=0; i<count; ++i) {
        let a = s.itemAt(i) as number[]
        const e = eigen(a)
        for (let j=0; j<dim; ++j) r.array[k++] = e.values[j]
    }

    return r
}

/**
 * Get eigen vectors. itemSize of the returned Serie is therefore 9 and the coordinates of the 
 * three eigen vectors are classified as follow: `[v1x,v1y,v1z, v2x,v2y,v2z, v3x, v3y, v3z]`
 * @category Dataframe
 */
 export const eigenVector = (s: Serie) => {
    if (s===undefined)    throw new Error ('series is undefined')

    let dim = s.dimension
    if (s.dimension===2 && (s.itemSize === 3 || s.itemSize===4)) {}
    else if (s.dimension===3 && (s.itemSize === 6 || s.itemSize===9)) {}
    else {
        throw new Error(`Series does not have itemSize = 3, 4, 6 or 9 ([xx,xy,yy], [xx,xy,xz,yy,yz,zz], [xx, xy, yx, yy] or [xx,xy,xz,yx,yy,yz,zx,zy,zz]). Got ${s.itemSize}`)
    }

    // if (s.itemSize !== 6 && s.itemSize!==9) {
    //     throw new Error(`Series does not have itemSize = 6 or 9 (symmetric tensor [xx,xy,xz,yy,yz,zz] or [xx,xy,xz,yx,yy,yz,zx,zy,zz]). Got ${s.itemSize}`)
    // }

    const r     = s.image(s.count, dim**2)
    const count = s.count
    let k       = 0

    for (let i=0; i<count; ++i) {
        let a = s.itemAt(i) as number[]
        const e = eigen(a)
        e.vectors.forEach( v => r.array[k++] = v)
    }

    return r
}
