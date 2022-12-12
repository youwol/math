/**
 * @example
 * ```ts
 * const array = [1,6,3,2,8,9,5]
 * const mm = new MinMax(array)
 * console.log( mm.min ) // 1
 * console.log( mm.max ) // 9
 *
 * mm.reset()
 * mm.add([7,2,0,6])
 * mm.add(8)
 * console.log( mm.min ) // 0
 * console.log( mm.max ) // 8
 * ```
 */
export class MinMax {
    private m_ = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]

    constructor(values?: any) {
        if (values !== undefined) {
            this.add(values)
        }
    }

    reset() {
        this.m_ = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
    }

    get min() {
        return this.m_[0]
    }
    get max() {
        return this.m_[1]
    }

    get length() {
        return this.m_[1] - this.m_[0]
    }

    get value() {
        return this.m_
    }

    /**
     * Normalize a value (lerp) according to the min/max of this
     */
    normalize(v: number): number {
        return (v - this.min) / (this.max - this.min)
    }

    add(values: any) {
        if (Array.isArray(values)) {
            values.forEach((v: number) => {
                if (v < this.m_[0]) {
                    this.m_[0] = v
                }
                if (v > this.m_[1]) {
                    this.m_[1] = v
                }
            })
        } else {
            const v = values
            if (v < this.m_[0]) {
                this.m_[0] = v
            }
            if (v > this.m_[1]) {
                this.m_[1] = v
            }
        }
        return this
    }
}
