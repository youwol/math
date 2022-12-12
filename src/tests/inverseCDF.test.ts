import { inverseCDF, DistributionFunction } from '../lib'

const NUM_TEST_SAMPLES = 100000
const NUM_HISTOGRAM_BUCKETS = 11

function Test(PDF: DistributionFunction, invCDF: DistributionFunction) {
    // generate the histogram
    const histogram = new Array(NUM_HISTOGRAM_BUCKETS).fill(0)
    for (let i = 0; i < NUM_TEST_SAMPLES; ++i) {
        // put a uniform random number into the inverted CDF to sample the PDF
        const x = Math.random()
        const y = invCDF(x)

        // increment the correct bin on the histogram
        const bin = Math.floor(y * NUM_HISTOGRAM_BUCKETS)
        histogram[Math.min(bin, NUM_HISTOGRAM_BUCKETS - 1)]++
    }

    const h1 = []
    const h2 = []
    for (let i = 0; i < NUM_HISTOGRAM_BUCKETS; ++i) {
        const x = (i + 0.5) / NUM_HISTOGRAM_BUCKETS
        const pdfSample = PDF(x)
        h1.push(pdfSample)
        h2.push((NUM_HISTOGRAM_BUCKETS * histogram[i]) / NUM_TEST_SAMPLES)
    }
    return {
        h1,
        h2,
    }
}

function TestPDFOnly(PDF: DistributionFunction) {
    return Test(PDF, inverseCDF(PDF))
}

// ----------------------------------------------------------------------

function compare(o: { h1: Array<number>; h2: Array<number> }) {
    const a = []
    o.h1.forEach((v1, index) => {
        const v2 = o.h2[index]
        a.push(Math.abs((v2 * 100) / v1).toFixed(1) + '%')
        expect(v1).toBeCloseTo(v2, 1)
    })
    // console.log(a)
}

function perform(
    name: string,
    PDF: DistributionFunction,
    iCDF: DistributionFunction,
) {
    // console.log('----------------------------------', name)
    compare(Test(PDF, iCDF))
    compare(TestPDFOnly(PDF))
}

test('test1', () => {
    perform(
        '1',
        (x) => 1,
        (x) => x,
    )
    perform(
        '2x',
        (x) => 2 * x,
        (x) => Math.sqrt(x),
    )
    perform(
        '3x^2',
        (x) => 3 * x ** 2,
        (x) => Math.pow(x, 1.0 / 3.0),
    )

    // console.log('---------------------------------- x^3 - 10x^2 + 5x + 11')
    // compare(TestPDFOnly( x => (x**3 - 10.0**2 + 5.0*x + 11.0) / 10.417 ))

    // const F  = x => 1/(x*x-x+1)
    // const iF = inverseCDF(F)
    // for (let i=0; i<20; ++i) {
    //     const x = Math.random()
    //     console.log( F(x), iF(x) )
    // }
})
