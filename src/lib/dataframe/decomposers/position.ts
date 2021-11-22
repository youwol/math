import { Serie, DataFrame, Decomposer, apply } from "@youwol/dataframe"

/**
 * Make x, y and z coordinates accessible as serie if `position' is
 * present in the dataframe.
 * @category Decomposition
 */
export class PositionDecomposer implements Decomposer {
    /**
     * 
     * @param names_ The names for the position coordinates
     * @default names = `['x', 'y', 'z']`
     */
    constructor(private readonly names_ = ['x', 'y', 'z']) {
        if (names_.length!==3) throw new Error('names must be an array of 3 strings')
    }
    /**
     * @hidden 
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (itemSize!==1 || name!=='positions') return []
        return this.names_
    }
    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (itemSize===1) {
            const serie = df.series['positions']
            switch(name) {
                case this.names_[0] : return apply(serie, item => item[0] )//.setName(this.names_[0])
                case this.names_[1] : return apply(serie, item => item[1] )//.setName(this.names_[1])
                case this.names_[2] : return apply(serie, item => item[2] )//.setName(this.names_[2])
            }
        }
    }
}
