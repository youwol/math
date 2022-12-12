import { Serie, DataFrame, Decomposer, exists } from "@youwol/dataframe"
import { div, norm } from ".."
import { NormalsDecomposer } from "./normals"

/**
 * Get the area of the triangles
 * @category Dataframe/decomposers
 */
export class AreaDecomposer implements Decomposer {
    constructor(private readonly name: string = 'area') {
    }
    /**
     * @hidden 
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (itemSize !== 1) {return []}
        if (!exists(df, 'positions') && !exists(df, 'indices')) {return []}
        return [this.name]
    }
    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (name !== this.name) {return undefined}
        const normals = (new NormalsDecomposer).serie(df, itemSize, 'normals')
        if (normals) {return div( norm( normals ), 2)}//.setName(this.name)
        return undefined
    }
}