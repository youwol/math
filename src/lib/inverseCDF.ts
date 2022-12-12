// -----------------------------------------------------------------------------
// Inspired from https://blog.demofox.org/2017/08/05/generating-random-numbers-from-a-specific-distribution-by-inverting-the-cdf/
// -----------------------------------------------------------------------------

export type DistributionFunction = (x: number) => number

/**
 * Get an inverse CDF function of a PDF function using a lookup table
 */
export function inverseCDF(PDF: DistributionFunction, lutSize = 100) {
    let lut: Array<number> = []

    let value = 0
    for (let i = 0; i < lutSize; ++i) {
        value += PDF( i/(lutSize-1) )
        lut.push(value)
    }
    lut = lut.map( v => v/value) // Normalize the CDF
 
    const d = 1/lutSize
    return (y: number) => {
        if (y<lut[0]) {
            return y/lut[0]*d
        }
        const i = lowerBound(lut, y)
        return (i + (y - lut[i-1]) / (lut[i] - lut[i-1]))*d
    }
}

// --------------------------------------------------------

// Implement the std::lower_bound function
//
const lowerBound = (A: Array<number>, T: number) => {
    let i = 0, j = A.length
    while (i < j) {
        const k = Math.floor((i + j) / 2)
        if (A[k]<T) {i = k+1}
        else {j = k}
    }
    return i
}
