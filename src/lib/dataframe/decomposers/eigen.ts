import { apply, Serie, DataFrame, Decomposer } from "@youwol/dataframe"
import { eigenValue, eigenVector } from '..'

/**
 * Eigen values for series with itemSize = 6
 * @category Decomposition
 */
export class EigenValuesDecomposer implements Decomposer {
    /**
     * @hidden 
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (serie.itemSize!==6 || itemSize!==1) return []
        return [name+'1', name+'2', name+'3']
    }
    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (itemSize!==1) return undefined
        let newName = name.substring(0, name.length - 1)
        let serie   = df.series[newName]
        let id = parseInt( name.charAt(name.length-1) )

        if (serie === undefined)  return undefined
        if (serie.itemSize !== 6) return undefined
        if (id<1 || id>3)         return undefined

        return apply( eigenValue(serie), item => item[id-1] )//.setName(name)
    }
}

/**
 * Eigen vectors for series with itemSize = 6
 * @category Decomposition
 */
export class EigenVectorsDecomposer implements Decomposer {
    /**
     * @hidden 
     */
    names(df:DataFrame, itemSize: number, serie: Serie, name: string) {
        if (serie.itemSize!==6 || itemSize!==3) return []
        return [name+'1', name+'2', name+'3']
    }
    /**
     * @hidden 
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (itemSize!==3) return undefined
        let newName = name.substring(0, name.length - 1)
        let serie   = df.series[newName]
        let id = parseInt( name.charAt(name.length-1) )

        if (serie === undefined)  return undefined
        if (serie.itemSize !== 6) return undefined
        if (id<1 || id>3)         return undefined

        id -= 1 // now in between 0 and 2
        return apply( eigenVector(serie), item => [item[3*id], item[3*id+1], item[3*id+2]] )//.setName(name)
    }
}