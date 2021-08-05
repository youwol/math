import { Serie } from '@youwol/dataframe'
import { max, min } from '../minMax'
import { mean } from './mean'
import { q25, q50, q75 } from './quantile'
import { std } from './std'

/**
 * @category Dataframe
 */
export const describe = (s: Serie): any => {
    if (s===undefined) throw new Error ('serie is undefined')
    if (s.itemSize !== 1) throw new Error ('serie must have itemSize = 1')

    return {
        count: s.count,
        mean: mean(s),
        std : std(s),
        min : min(s),
        q25 : q25(s),
        q50 : q50(s),
        q75 : q75(s),
        max : max(s),
    }
}
