const math = require('../../dist/@youwol/math')
const df   = require('../../../dataframe/dist/@youwol/dataframe')
const io   = require('../../../io/dist/@youwol/io')
const fs   = require('fs')

const tol  = 1e-7
const rand = _ => Math.random()*10000

function check(stresses) {
    const evectors = math.eigenVector(stresses)
    evectors.forEach( stress => {
        const S1 = [stress[0], stress[1], stress[2]]
        const S2 = [stress[3], stress[4], stress[5]]
        const S3 = [stress[6], stress[7], stress[8]]

        const c1 = math.vec.dot(S1, S2)
        const c2 = math.vec.dot(S1, S3)
        const c3 = math.vec.dot(S2, S3)

        if (Math.abs(c1)>tol) {console.error('S1 and S2 are NOT ortho')}
        if (Math.abs(c2)>tol) {console.error('S1 and S3 are NOT ortho')}
        if (Math.abs(c3)>tol) {console.error('S2 and S3 are NOT ortho')}
    })
}

const series = []
const grid   = io.decodeGocadTS( fs.readFileSync('/Users/fmaerten/data/arch/mud/simulations-grid.ts', 'utf8') )[0]

// Testing the 6 simulations
for (let i=1; i<=6; ++i) {
    const stresses = grid.series[`stress${i}`]
    series.push(stresses)
    check(stresses)
}

// Testing for superposition multiple times
{
    for (let i=0; i<100; ++i) {
        check( math.weightedSum( series, new Array(6).fill(0).map( v => rand() ) ) )
    }

    // Other test from Romain's script in flux
    function get(name) {
        const idx = name==='S1' ? 0 : name==='S2' ? 3 : 6
        return math.eigenVector(stresses).map(v => [v[idx],v[idx+1],v[idx+2]] )
    }

    const stresses = math.weightedSum( series, new Array(6).fill(0).map( v => rand() ) )
    const S1 = get('S1')
    const S2 = get('S2')
    const S3 = get('S3')
    for (let i=0; i<S1.count; ++i) {
        const c1 = math.vec.dot(S1.itemAt(i), S2.itemAt(i))
        const c2 = math.vec.dot(S1.itemAt(i), S3.itemAt(i))
        const c3 = math.vec.dot(S2.itemAt(i), S3.itemAt(i))
        if (Math.abs(c1)>tol) {console.error('S1 and S2 are NOT ortho')}
        if (Math.abs(c2)>tol) {console.error('S1 and S3 are NOT ortho')}
        if (Math.abs(c3)>tol) {console.error('S2 and S3 are NOT ortho')}
    }
}

// Data From flux
{
    let S1json = fs.readFileSync('S1.json')
    const sS1 = Object.entries(JSON.parse(S1json)).map(([ key, val ]) => val)
    const S1 = df.Serie.create({array: sS1, itemSize: 3})

    let S2json = fs.readFileSync('S2.json')
    const sS2 = Object.entries(JSON.parse(S2json)).map(([ key, val ]) => val)
    const S2 = df.Serie.create({array: sS2, itemSize: 3})

    let S3json = fs.readFileSync('S3.json')
    const sS3 = Object.entries(JSON.parse(S3json)).map(([ key, val ]) => val)
    const S3 = df.Serie.create({array: sS3, itemSize: 3})

    for (let i=0; i<S1.count; ++i) {
        const c1 = math.vec.dot(S1.itemAt(i), S2.itemAt(i))
        const c2 = math.vec.dot(S1.itemAt(i), S3.itemAt(i))
        const c3 = math.vec.dot(S2.itemAt(i), S3.itemAt(i))
        if (Math.abs(c1)>tol) {console.error('S1 and S2 are NOT ortho')}
        if (Math.abs(c2)>tol) {console.error('S1 and S3 are NOT ortho')}
        if (Math.abs(c3)>tol) {console.error('S2 and S3 are NOT ortho')}
    }
}