import { Serie, createTyped, DataFrame, Decomposer, exists } from "@youwol/dataframe"

/**
 * Get the valence for each node (nb of incident triangles)
 * @category Decomposition
 */
export class ValenceDecomposer implements Decomposer {
    constructor(private readonly name: string = 'valence') {
    }
    /**
     * @hidden 
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (itemSize !== 1) return []
        if (!exists(df, 'positions') && !exists(df, 'indices')) return []
        return [this.name]
    }
    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (name !== this.name) return undefined
        const positions = df.series['positions']
        const indices   = df.series['indices']
        if (!positions || !indices) return undefined

        const ids = new Array(positions.count).fill(0)
        indices.forEach( t => {
            ids[t[0]]++
            ids[t[1]]++
            ids[t[2]]++
        })

        return Serie.create({array: createTyped(Int8Array, ids, true), itemSize: 1})//.setName(this.name)
    }
}
