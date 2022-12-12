import { Serie, DataFrame, Decomposer, apply } from "@youwol/dataframe"

/**
 * Transform a scalar attribute into multiple fringes
 * @category Dataframe/decomposers
 */
export class Fringes implements Decomposer {
    constructor(private readonly name: string, private readonly fringes: number) {
    }

    /**
     * @hidden
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (itemSize !== 1) {return []}
        return [this.name]
    }

    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (name !== this.name) {return undefined}

        const u = df.series[this.name]
        if (!u) {return undefined}

        const frac = (val: number) => val - Math.floor(val)
        return apply(u, v => Math.abs(this.fringes*frac(v/this.fringes)) )
    }
}