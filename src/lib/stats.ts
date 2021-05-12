//import { maxArray } from "./arrays"

/**
 * In mathematics and statistics, the arithmetic mean, or simply the mean or average when the
 * context is clear, is the central tendency of a collection of numbers taken as the sum of the
 * numbers divided by the size of the collection. The collection is often the sample space of an
 * experiment. The term "arithmetic mean" is preferred in mathematics and statistics because it
 * helps distinguish it from other means such as the geometric and harmonic mean.
 * @category Stats
 */
export function mean(attribute: number[]) {
    const v = attribute.reduce( (acc: number, cur: number) => acc+cur )
    return v/attribute.length
}

/**
 * In statistics and probability theory, standard deviation (represented by the symbol sigma)
 * shows how much variation or "dispersion" exists from the average (mean, or expected value).
 * A low standard deviation indicates that the data points tend to be very close to the mean; high
 * standard deviation indicates that the data points are spread out over a large range of values.
 *
 * The standard deviation of a random variable, statistical population, data set, or probability distribution
 * is the square root of its variance. It is algebraically simpler though practically less robust
 * than the average absolute deviation. A useful property of standard deviation is that, unlike
 * variance, it is expressed in the same units as the data.
 * @category Stats
 */
export function stdev(attribute: number[]) {
    const xb = mean(attribute)
    const v = attribute.reduce( (acc: number, cur: number) => acc + (cur-xb)**2 )
    return Math.sqrt(v/attribute.length)
}

/**
 * In mathematics, the root mean square (abbreviated RMS or rms), also known as the quadratic mean,
 * is a statistical measure of the magnitude of a varying quantity. It is especially useful when variates
 * are positive and negative, e.g., sinusoids. RMS is used in various fields, including electrical engineering.
 * 
 * It can be calculated for a series of discrete values or for a continuously varying function.
 * The name comes from the fact that it is the square root of the mean of the squares of the values.
 * It is a special case of the generalized mean with the exponent p = 2.
 * @category Stats
 */
export function rms(attribute: number[]) {
    const v = attribute.reduce( (acc: number, cur: number) => acc + cur**2 )
    return Math.sqrt(v/attribute.length)
}

/**
 * @category Stats
 */
export function median(a: number[], doSort = true) {
    if(a.length ===0) return 0
  
    if (doSort) a.sort( (a,b) => a-b )
    const half = Math.floor(a.length/2)
    if (a.length % 2) return a[half]
    return (a[half - 1] + a[half])/2
}

/**
 * Detect the outlier boundaries of an array of number.
 * 
 * The algorithm is as follow:
 * 1. First, detect points that are close to the faults at threshold*mean_edge_length.
 * 2. Second, apply mustache times the interquartile range to detect outliers.
 * 3. return an array of boolean with true values for outliers
 *
 * **From WIKIPEDIA**:
 * In descriptive statistics, the interquartile range (IQR), also called the midspread or
 * middle fifty, is a measure of statistical dispersion, being equal to the difference
 * between the upper and lower quartiles, `IQR = Q3 − Q1`. In other words, the IQR
 * is the 1st Quartile subtracted from the 3rd Quartile; these quartiles can be clearly
 * seen on a box plot on the data. It is a trimmed estimator, defined as the 25% trimmed
 * mid-range, and is the most significant basic robust measure of scale. 
 *
 * @param arr The array of number 
 * @param mustache The statistical distance for which a value is considered as outlier.
 * Default value is 6.
 * @returns An array of boolean values describing outliers
 * @category Stats
 */
export function iqr(arr: number[], mustache: number): boolean[] {
    const array = arr.map( v => Number.isNaN(v) ? Number.POSITIVE_INFINITY : v)
    const NaN_ = Number.NaN
    const q25 = percentile(array, 25)
    const q75 = percentile(array, 75)
    if (q25==NaN_ || q75==NaN_) return []

    const IQR = (q75-q25)
    const outlier_min = q25 - mustache*IQR
    const outlier_max = q75 + mustache*IQR

    return array.map( v => v>outlier_max || v<outlier_min)
}

/**
 * Get the percentile of an array.
 *
 * @param arr The array of number
 * @param percent The percentile to use
 * @returns The percentile of the array
 * @category Stats
 */
export function percentile(arr: number[], percent: number): number {
    const values = [...arr] // copy
    values.sort( (a,b) => a-b )

    const position = (values.length-1.0) * percent / 100.0
    const    index = Math.trunc(position)
    const previous_element = values[index]
    const delta = position - index
    if (Math.abs(delta) <= 1e-34) return previous_element
    
    const next_index = index + 1
    const next_element = values[next_index]
    return previous_element + delta*(next_element - previous_element)
}
