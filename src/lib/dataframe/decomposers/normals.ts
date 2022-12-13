import {
    Serie,
    createTyped,
    DataFrame,
    Decomposer,
    exists,
} from '@youwol/dataframe'
import { vec } from '../../'

/**
 * Get normals to the triangles of a mesh
 * @category Dataframe/decomposers
 */
export class NormalsDecomposer implements Decomposer {
    constructor(private readonly name: string = 'normals') {}
    /**
     * @hidden
     */
    names(df: DataFrame, itemSize: number, _serie: Serie, _name: string) {
        if (itemSize !== 3) {
            return []
        }
        if (!exists(df, 'positions') && !exists(df, 'indices')) {
            return []
        }
        return [this.name]
    }
    /**
     * @hidden
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (name !== this.name) {
            return undefined
        }
        const positions = df.series['positions']
        const indices = df.series['indices']
        if (!positions || !indices) {
            return undefined
        }

        const data = new Array(indices.count).fill(0)

        let i = 0
        indices.forEach((t) => {
            const v1 = positions.itemAt(t[0]) as vec.Vector3
            const v2 = positions.itemAt(t[1]) as vec.Vector3
            const v3 = positions.itemAt(t[2]) as vec.Vector3
            const n = vec.cross(
                vec.create(v1, v2) as vec.Vector3,
                vec.create(v1, v3) as vec.Vector3,
            )
            data[i++] = n[0]
            data[i++] = n[1]
            data[i++] = n[2]
        })

        return Serie.create({
            array: createTyped(Float32Array, data, true),
            itemSize: 3,
        }) //.setName(this.name)
        //return createSerie({data: createTyped(Float32Array, data, true), itemSize: 3}).setName(this.name)
    }
}
