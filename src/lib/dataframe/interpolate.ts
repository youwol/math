import { IArray } from '@youwol/dataframe'

export enum InterpolateDirection {
    INCREASING,
    DECREASING,
}

export function meshInterpolate({
    attribute,
    topology,
    size = 3,
}: // direction = InterpolateDirection.INCREASING,
{
    attribute: IArray
    topology: IArray
    size?: number
    direction?: InterpolateDirection
}): IArray {
    let topo = undefined
    if (attribute === undefined) {
        console.warn('Cannot meshInterpolate, attribute is undefined')
        return undefined
    }
    if (attribute.length === 0) {
        console.warn('Cannot meshInterpolate, attribute is empty')
        return undefined
    }
    if (topology === undefined) {
        console.warn('Cannot meshInterpolate, attribute is topology')
        return undefined
    }
    if (topology.length === 0) {
        console.warn('Cannot meshInterpolate, topology is empty')
        return undefined
    }

    if (typeof topology[0] === 'number') {
        // Humm, better to use [[], []...]
        // Have to use size to know the chunk size in topology
        topo = []
        if (topology.length % size !== 0) {
            throw new Error(
                `Cannot meshInterpolate, topology (of size ${topology.length}) is not divisable by ${size}`,
            )
        }
        for (let i = 0; i < topology.length; i += size) {
            const a: Array<number> = []
            for (let j = 0; j < size; ++j) {
                a.push(topology[i + j])
            }
            topo.push(a)
        }
    } else {
        topo = topology
    }

    throw new Error('TODO')

    // switch (
    //     direction
    //     //case InterpolateDirection.INCREASING: return interpolateIncreasingCombels({from: attribute, topology: topo})
    //     //case InterpolateDirection.DECREASING: return interpolateDecreasingCombels({from: attribute, topology: topo})
    // ) {
    // }
}

// P R I V A T E  starting from here
/*
function getMinMax(topology: Array<Array<number>>) {
    const minMax = [Infinity, -Infinity]
    topology.forEach((combel) => {
        const m = array.minMax(combel)
        minMax[0] = Math.min(minMax[0], m[0])
        minMax[1] = Math.max(minMax[1], m[1])
    })
    return minMax
}
*/

/*
function interpolateIncreasingCombels({
    from,
    topology,
}: {
    from: Array<number | number[]>
    topology: Array<Array<number>>
}): Array<number | number[]> {
    const minMax = getMinMax(topology)
    if (minMax[0] < 0) {
        throw new Error(`Topology contains negatif indices`)
    }

    let a = from[0]
    if (!(typeof a === 'number')) {
        a = a.slice().fill(0)
    } else {
        a = 0
    }

    const to = new Array(topology.length).fill(a)

    if (!Array.isArray(a)) {
        topology.forEach((combel, index) => {
            to[index] = combel.reduce((v, i) => {
                const b = from[i] as number
                return v + b
            }) / combel.length
        })
    } else {
        const aa = a as number[]
        topology.forEach((combel, index) => {
            let sum = aa.slice()
            combel.forEach((index) => {
                const b = from[index]
                sum = sum.map((num: number, idx: number) => num + b[idx])
            })
            to[index] = array.scale(sum, 1 / combel.length)
        })
    }

    return to
}

function interpolateDecreasingCombels({
    from,
    topology,
}: {
    from: Array<number | number[]>
    topology: Array<Array<number>>
}): Array<number | number[]> {
    const minMax = getMinMax(topology)

    //const minMax = topology.reduce( combel => minMaxArray(combel) )
    if (minMax[0] < 0) {
        throw new Error(`Topology contains negatif indices`)
    }

    let a = from[0]
    let size = 1
    let to: Array<number | number[]> = undefined

    if (Array.isArray(a)) {
        const aa = a.slice().fill(0)
        size = a.length
        to = new Array(minMax[1] + 1).fill(undefined).map((_) => aa.slice())
    } else {
        a = 0
        to = new Array(minMax[1] + 1).fill(0)
    }

    const nbr = new Array(to.length).fill(0)

    if (!Array.isArray(a)) {
        const too = to as number[]
        topology.forEach((idNodes, idFace) => {
            const v = from[idFace] as number
            idNodes.forEach((id) => {
                too[id] += v
                nbr[id]++
            })
        })
        for (let i = 0; i < to.length; ++i) {
            too[i] /= nbr[i]
        }
    } else {
        topology.forEach((idNodes, idFace) => {
            const v = from[idFace]
            idNodes.forEach((id) => {
                const vv = to[id]
                for (let i = 0; i < size; ++i) {
                    vv[i] += v[i]
                }
                nbr[id]++
            })
        })
        for (let j = 0; j < to.length; ++j) {
            for (let i = 0; i < size; ++i) {
                to[j][i] /= nbr[j]
            }
        }
    }

    return to
}
*/
