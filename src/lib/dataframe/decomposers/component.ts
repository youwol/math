import {
    apply,
    Serie,
    DataFrame,
    Decomposer,
    nameOfSerie,
} from '@youwol/dataframe'

/**
 * Allows to get components of serie for which itemSize > 1.
 *
 * For instance, for a serie named `U` with `itemSize=2` and `dimension=2`, components names will be
 * `Ux` and `Uy` (2 components).
 *
 * For a serie named `U` with `itemSize=3` and `dimension=3`, components names will be
 * `Ux`, `Uy` and `Uz` (3 components).
 *
 * For a serie named `S` with `itemSize=3` and `dimension=2` (symmetric rank 2 tensor of dim 2), components names will be
 * `Sxx`, `Sxy` and `Syy` (3 components).
 *
 * For a serie named `S` with `itemSize=4` and `dimension=2` (general rank 2 tensor of dim 2), components names will be
 * `Sxx`, `Sxy`, `Syx` and `Syy` (4 components).
 *
 * For a serie named `S` with `itemSize=6` and `dimension=3` (symmetric rank 2 tensor of dim 3), components names will be
 * `Sxx`, `Sxy`, `Sxz`, `Syy`, `Syz` and `Szz` (6 components).
 *
 * For a serie named `S` with `itemSize=9` and `dimension=3` (general rank 2 tensor of dim 3), components names
 * will be `Sxx`, `Sxy`, `Sxz`, `Syx`, `Syy`, `Syz`, `Szx`, `Szy` and `Szz` (9 components).
 *
 * For all other series, index number are appended to the serie's name, starting at zero.
 * That is to say, for a serie named `E` with `itemSize=5`, components names will be
 * `E0`, `E1`, `E2`, `E3` and `E4`.
 * @category Dataframe/decomposers
 */
export class ComponentDecomposer implements Decomposer {
    /**
     * @hidden
     */
    names(df: DataFrame, itemSize: number, serie: Serie, name: string) {
        // Avoid using 'positions' and 'indices'
        if (name === 'positions' || name === 'indices') {
            return []
        }

        // Passed name is, e.g., 'U' && itemSize=3 && dimension=3
        const sname = nameOfSerie(df, serie)
        if (name === sname && serie.itemSize === 1) {
            return []
        }
        if (itemSize > 1) {
            return []
        }

        if (serie.dimension === 2) {
            switch (serie.itemSize) {
                case 2:
                    return vector2Names.map((n) => name + n)
                case 3:
                    return smatrix2Names.map((n) => name + n)
                case 4:
                    return matrix2Names.map((n) => name + n)
            }
        } else {
            switch (serie.itemSize) {
                case 3:
                    return vector3Names.map((n) => name + n)
                case 6:
                    return smatrix3Names.map((n) => name + n)
                case 9:
                    return matrix3Names.map((n) => name + n)
            }
        }

        const names = []
        for (let i = 0; i < itemSize; ++i) {
            names.push(name + i)
        }
        return names
    }
    /**
     * @hidden
     */
    serie(df: DataFrame, itemSize: number, name: string): Serie {
        if (itemSize > 1) {
            return undefined
        }

        // vector2 / vector3
        let newName = name.substring(0, name.length - 1)
        let serie = df.series[newName]
        if (serie) {
            if (serie.dimension === 2) {
                for (let i = 0; i < vector2Names.length; ++i) {
                    if (name === newName + vector2Names[i]) {
                        return apply(serie, (item) => item[i])
                    }
                }
            } else {
                for (let i = 0; i < vector3Names.length; ++i) {
                    if (name === newName + vector3Names[i]) {
                        return apply(serie, (item) => item[i])
                    }
                }
            }
        }

        // (smatrix2 and matrix2) / (smatrix3 and matrix3)
        newName = name.substring(0, name.length - 2)
        serie = df.series[newName]
        if (serie) {
            if (serie.dimension === 2) {
                for (let i = 0; i < smatrix2Names.length; ++i) {
                    if (name === newName + smatrix2Names[i]) {
                        return apply(serie, (item) => item[i])
                    }
                }
                for (let i = 0; i < matrix2Names.length; ++i) {
                    if (name === newName + matrix2Names[i]) {
                        return apply(serie, (item) => item[i])
                    }
                }
            } else {
                for (let i = 0; i < smatrix3Names.length; ++i) {
                    if (name === newName + smatrix3Names[i]) {
                        return apply(serie, (item) => item[i])
                    }
                }
                for (let i = 0; i < matrix3Names.length; ++i) {
                    if (name === newName + matrix3Names[i]) {
                        return apply(serie, (item) => item[i])
                    }
                }
            }
        }

        // Others: use integer
        newName = name.substring(0, name.length - 1)
        serie = df.series[newName]
        if (serie) {
            for (let i = 0; i < itemSize; ++i) {
                if (name === newName + i) {
                    return apply(serie, (item) => item[i])
                }
            }
        }
    }
}

const vector2Names = ['x', 'y']
const smatrix2Names = ['xx', 'xy', 'yy']
const matrix2Names = ['xx', 'xy', 'yx', 'yy']

const vector3Names = ['x', 'y', 'z']
const smatrix3Names = ['xx', 'xy', 'xz', 'yy', 'yz', 'zz']
const matrix3Names = ['xx', 'xy', 'xz', 'yx', 'yy', 'yz', 'zx', 'zy', 'zz']
