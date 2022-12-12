import { Serie } from "@youwol/dataframe"
import { normalize } from "../lib"


test('operation normalize', () => {
    const R1 = 1/Math.sqrt(3)
    const L  = Math.sqrt(1+4+9)
    let r    = undefined

    const s = Serie.create( {array: [1,1,1, 1,2,3, 1,0,0], itemSize: 3})
    const t = normalize( s )
    // console.log(t)

    r = t.itemAt(0)
    expect( r[0] ).toBeCloseTo(R1)
    expect( r[1] ).toBeCloseTo(R1)
    expect( r[2] ).toBeCloseTo(R1)

    r = t.itemAt(1)
    expect( r[0] ).toBeCloseTo(1/L)
    expect( r[1] ).toBeCloseTo(2/L)
    expect( r[2] ).toBeCloseTo(3/L)

    r = t.itemAt(2)
    expect( r[0] ).toBeCloseTo(1)
    expect( r[1] ).toBeCloseTo(0)
    expect( r[2] ).toBeCloseTo(0)
})
