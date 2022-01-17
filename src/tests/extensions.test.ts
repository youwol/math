import { Serie } from "@youwol/dataframe"

// import the extensions
// This will auglent the module Serie with the necessary operations
import '../lib/dataframe/extensions'


test('operation-extensions add', () => {
    const a = Serie.create({array: new Array(20).fill(2), itemSize: 2} )
    const b = Serie.create({array: new Array(20).fill(-3), itemSize: 2} )

    let sum = a
        .add(b)
        .abs()
    sum.array.forEach( _ => expect(_).toEqual(+1) )

    sum = b
        .abs()
        .add(a)
    sum.array.forEach( _ => expect(_).toEqual(+5) )
})
