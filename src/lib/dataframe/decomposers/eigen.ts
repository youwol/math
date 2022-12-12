import { apply, Serie, DataFrame, Decomposer } from "@youwol/dataframe"
import { eigenValue, eigenVector } from '..'

/**
 * Eigen values for series with itemSize = 3 or 6
 * @category Dataframe/decomposers
 */
export class EigenValuesDecomposer implements Decomposer {
    /**
     * @hidden
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (name==='positions' || name==='indices') {return []}
        if (serie.dimension===2 && (serie.itemSize!==3 || itemSize!==1) ) {return []}
        if (serie.dimension===3 && (serie.itemSize!==6 || itemSize!==1) ) {return []}

        if (serie.dimension===2) {return [name+'1', name+'2']}
        return [name+'1', name+'2', name+'3']
    }
    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (itemSize!==1) {return undefined}
        const newName = name.substring(0, name.length - 1)
        const serie   = df.series[newName]
        const id = parseInt( name.charAt(name.length-1) )

        if (serie === undefined)  {return undefined}

        if (serie.dimension ===2) {
            if (serie.itemSize !== 3) {return undefined}
            if (id<1 || id>2)         {return undefined}
        }
        else {
            if (serie.itemSize !== 6) {return undefined}
            if (id<1 || id>3)         {return undefined}
        }

        return apply( eigenValue(serie), item => item[id-1] )
    }
}

/**
 * Eigen vectors for series with itemSize = 3 or 6
 * @category Dataframe/decomposers
 */
export class EigenVectorsDecomposer implements Decomposer {
    /**
     * @hidden 
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (name==='positions' || name==='indices') {return []}
        if (serie.dimension===2) {
            if (serie.itemSize!==3 || itemSize!==2) {return []}
            return [name+'1', name+'2']
        }
        else {
            if (serie.itemSize!==6 || itemSize!==3) {return []}
            return [name+'1', name+'2', name+'3']
        }
    }
    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        const newName = name.substring(0, name.length - 1)
        let id = parseInt( name.charAt(name.length-1) )

        const serie = df.series[newName]
        if (serie === undefined) {return undefined}

        if (serie.dimension===2) {
            if (itemSize!==2)         {return undefined}
            if (serie === undefined)  {return undefined}
            if (serie.itemSize !== 3) {return undefined}
            if (id<1 || id>2)         {return undefined}

            id -= 1 // now in between 0 and 1
            return apply( eigenVector(serie), item => [item[2*id], item[2*id+1]] )
        }
        else {
            if (itemSize!==3)         {return undefined}
            if (serie === undefined)  {return undefined}
            if (serie.itemSize !== 6) {return undefined}
            if (id<1 || id>3)         {return undefined}

            id -= 1 // now in between 0 and 2
            return apply( eigenVector(serie), item => [item[3*id], item[3*id+1], item[3*id+2]] )
        }
    }
}
