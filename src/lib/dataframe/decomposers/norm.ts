import { Serie, DataFrame, Decomposer } from '@youwol/dataframe'
import { norm } from '..'

/**
 * Get the norm of any serie with itemSize > 1 (i.e., norm of any vector)
 * @category Dataframe/decomposers
 */
export class VectorNormDecomposer implements Decomposer {
    /**
     * @hidden
     */
    names(df: DataFrame, itemSize: number, serie: Serie, name: string) {
        if (name === 'positions' || name === 'indices') {
            return []
        }
        if (serie.itemSize <= 1 || itemSize !== 1) {
            return []
        }
        if (
            (serie.dimension === 2 && serie.itemSize === 2) ||
            (serie.dimension === 3 && serie.itemSize === 3)
        ) {
            return [name] // same name as the vector but will be a scalar (itemSize=1)
        }
        return []
    }
    /**
     * @hidden
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (itemSize !== 1) {
            return undefined
        }
        if (name === 'positions' || name === 'indices') {
            return undefined
        }

        const serie = df.series[name] // since same name
        if (serie === undefined) {
            return undefined
        }
        if (serie.itemSize <= 1) {
            return undefined
        }

        if (
            (serie.dimension === 2 && serie.itemSize === 2) ||
            (serie.dimension === 3 && serie.itemSize === 3)
        ) {
            return norm(serie)
        }

        return undefined
    }
}
