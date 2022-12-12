import { covariance, mean, weightedMean , describe as statDescribe, bins } from '../lib/dataframe/stats'
import { Serie } from '@youwol/dataframe'
import { IQR, isOutliers, notOutliers, outliers, q25, q75 } from '../lib/dataframe/stats/quantile'

test('operation mean itemSize=3', () => {
    const serie = Serie.create( {array: new Array(9).fill(0).map ( (_,i) => i), itemSize: 3})
    const a = mean(serie) as number[]
    const sol = [3, 4, 5]
    a.forEach( (_,i) => expect(_).toEqual(sol[i]) )
})

test('operation mean itemSize=1', () => {
    const serie = Serie.create( {array: new Array(9).fill(0).map ( (_,i) => i), itemSize: 1})
    const a = mean(serie) as number
    const sol = ( 9*(9-1)/2 )/9
    expect(a).toEqual(sol)
})

test('operation weoghtedMean itemSize=1', () => {
    const serie = Serie.create( {array: [1, 2, 3], itemSize: 1})
    const w     = Serie.create( {array: [7, 1, 11], itemSize: 1})
    
    const a = weightedMean(serie, w)

    let W   = 0
    let sol = 0
    for (let i=0; i<w.array.length; ++i) {
        sol += serie.array[i] * w.array[i]
        W += w.array[i]
    }
    sol /= W

    expect(a).toEqual(sol)
})

test('stats cov', () => {
    let x: Serie, y: Serie, c: number

    x = Serie.create( {array: [1, 2, 3, 4], itemSize:1})
    y = Serie.create( {array: [5, 6, 7 ,8], itemSize:1})
    c = covariance(x,y)
    expect(c).toBe(1.25)

    x = Serie.create( {array: [0.90010907, 0.13484424, 0.62036035], itemSize:1})
    y = Serie.create( {array: [0.12528585, 0.26962463, 0.51111198], itemSize:1})
    c = covariance(x,y)
    expect(c).toBeCloseTo(-0.011238)
    
})

test('stats quantile', () => {
    const s = Serie.create({
        array: [57, 57, 57, 58, 63, 66, 66, 67, 67, 68, 69, 70, 70, 70, 70, 72, 73, 75, 75, 76, 76, 78, 79, 81],
        itemSize:1
    })

    const Q1 = q25(s)
    const Q3 = q75(s)
    expect( q25(s) ).toBe(66)
    expect( q75(s) ).toBe(75)
})

test('stats outliers', () => {
    const s = Serie.create({
        array: [57, 57, 57, 57, 58, 58, 59, 63, 66, 66, 67, 67, 68, 69, 70, 70, 70, 70, 72, 73, 75, 75, 76, 76, 78, 79, 81],
        itemSize:1
    })

    expect( q25(s) ).toBe(61)
    expect( q75(s) ).toBe(74)
    expect( IQR(s) ).toBe(13)

    expect(outliers(s, 0).array).toEqual([
        57, 57, 57, 57, 58, 58,
        59, 75, 75, 76, 76, 78,
        79, 81
    ])
    expect(notOutliers(s, 0).array).toEqual([
        63, 66, 66, 67, 67, 68,
        69, 70, 70, 70, 70, 72,
        73
    ])
    expect(isOutliers(s, 0).array).toEqual([
        true,  true,  true,  true,  true,
        true,  true,  false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        true,  true,  true,  true,  true,
        true,  true
    ])
})

test('stats describe', () => {
    const s = Serie.create({
        array: [57, 57, 57, 57, 58, 58, 59, 63, 66, 66, 67, 67, 68, 69, 70, 70, 70, 70, 72, 73, 75, 75, 76, 76, 78, 79, 81],
        itemSize:1
    })
    const d = statDescribe(s)
    // console.log(d)

    expect(d.count).toBe(27)
    expect(d.mean).toBeCloseTo( 67.92592592592592)
    expect(d.std).toBeCloseTo( 7.529051048213826)
    expect(d.min).toBe( 57)
    expect(d.q25).toBe( 61)
    expect(d.q50).toBe( 69)
    expect(d.q75).toBe( 74)
    expect(d.max).toBe( 81)
})

test('stats bons', () => {
    const s = Serie.create({
        array: [57, 57, 57, 58, 63, 66, 66, 67, 67, 68, 69, 70, 70, 70, 70, 72, 73, 75, 75, 76, 76, 78, 79, 81],
        itemSize:1
    })
    
    {
        const a = bins(s, {nb: 10})
        const nb = s.count
        const sol = [4, 0, 1, 2, 3, 5, 2, 4, 1, 2]

        expect(a.array).toEqual(sol)
        expect(nb).toEqual(sol.reduce( (cur,v) => cur+v, 0))
    }

    {
        const a = bins(s, {nb: 10, start: 0, stop: 100})
        const nb = s.count
        const sol = [0, 0,  0, 0, 0, 4, 7, 12, 1, 0]
        
        expect(a.array).toEqual(sol)
        expect(nb).toEqual(sol.reduce( (cur,v) => cur+v, 0))
    }

})