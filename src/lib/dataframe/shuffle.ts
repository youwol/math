import { Serie, array } from "@youwol/dataframe"

/**
 * Randomly shuffle a Serie
 * 
 * @example
 * ```js
 * import { Serie }   from '@youwol/dataframe
 * import { shuffle } from '@youwol/math
 * 
 * const s1 = Serie.create({array: [1,2,3, 9,8,7, 5,6,7], itemSize: 3})
 * const s2 = shuffle(s1) // e.g., [9,8,7, 5,6,7, 1,2,3]
 * ```
 * 
 * @category Dataframe
 */
export function shuffle(serie: Serie) {
    const arr = []
    serie.forEach( i => arr.push(i) )

    let currentIndex = arr.length
    let randomIndex: number
  
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
    }
  
    return Serie.create({
        array: array.flatten(arr), 
        itemSize: serie.itemSize,
        dimension: serie.dimension
    })
}
