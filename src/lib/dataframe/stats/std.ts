import { Serie } from '@youwol/dataframe'
import { sum } from '../sum';
import { mean } from './mean';

/**
 * See https://en.wikipedia.org/wiki/Box_plot
 * @category Dataframe/stats
 */
export const std = (s: Serie): number => {
    if (s===undefined) {throw new Error ('series is undefined')}
    if (s.itemSize !== 1) {throw new Error('quantile algorithm: itemSize must be 1')}

    const mu = mean(s) as number
    const diffArr = s.map(a => (a - mu) ** 2)
    return Math.sqrt( (sum(diffArr) as number) / (s.length - 1))
}
