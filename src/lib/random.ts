
/**
 * A Mersenne Twister 19937 random number generator. It is proved that the period is 2^19937-1,
 * and 623-dimensional equidistribution property is assured.
 * @see https://en.wikipedia.org/wiki/Mersenne_Twister
 * @param ubound The upper bound if any (1 by default)
 * @param floor Floor the result if true (false by default)
 * @example
 * ```ts
 * const a = randomMT()           // between 0 and 1 as a float number
 * const a = randomMT(1000)       // between 0 and 1000 as a float number
 * const a = randomMT(1000, true) // between 0 and 1000 as an integer
 * ```
 */
export const randomMT = (ubound?: number, floor = false) => {
    let rnd = extractNumber()

    if (ubound != undefined) {
        rnd *= ubound
    }

    // ~~ is a faster substitute for Math.floor()
    return floor ? ~~rnd : rnd
}



// ---------------------------------------------
// private
// ---------------------------------------------

// Create a length 624 array to store the state of the generator
const MT  = []
let index = 0
const init  = false

// Initialize the generator from a seed
function initializeGenerator(seed: number) {
    MT[0] = seed;
    for (let i = 1; 624 > i; ++i) { // loop over each other element
        MT[i] = (0x6c078965 * (MT[i-1] ^ (MT[i] >> 30)) + i) & 0xffffffff
    }
}

// Extract a tempered pseudorandom number based on the index-th value,
// calling generateNumbers() every 624 numbers
function extractNumber() {
    if (index == 0) {
        if (!init) {
            initializeGenerator(+new Date)
        }
        generateNumbers()
    }

    let y = MT[index];
    y ^= (y >> 11)
    y ^= (y <<  7) & 0x9d2c5680
    y ^= (y << 15) & 0xefc60000
    y ^= (y >> 18)
    index = (index + 1) % 624
    return y / 0x80000000
}

// Generate an array of 624 untempered numbers
function generateNumbers() {
    for (let i = 0; 624 > i; ++i) {
        const y = (MT[i] & 0x80000000) | (MT[(i+1) % 624] & 0x7fffffff)
        MT[i] = MT[(i + 397) % 624] ^ (y >> 1)
        if (y % 2 == 1) {
            MT[i] ^= 0x9908b0df
        }
    }
}
