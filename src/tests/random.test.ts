import { randomMT } from '../lib'

test('random-MT', () => {
    for (let i=0; i<100; ++i) {
        const a = randomMT()
        expect( a ).toBeGreaterThanOrEqual(0)
        expect( a ).toBeLessThanOrEqual(1)
    }
    
    for (let i=0; i<100; ++i) {
        const a = randomMT(1000)
        expect( a ).toBeGreaterThanOrEqual(0)
        expect( a ).toBeLessThanOrEqual(1000)
    }
})
