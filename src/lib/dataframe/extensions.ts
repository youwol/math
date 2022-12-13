// Test the extension of the module Serie
import { Serie } from '@youwol/dataframe'
import {
    abs,
    add,
    closeTo,
    cross,
    determinant,
    div,
    dot,
    eigenValue,
    eigenVector,
    equals,
    getNaN,
    inv,
    invert,
    minMax,
    mult,
    multMat,
    negate,
    norm,
    normalize,
    rand,
    rotate,
    round,
    scale,
    square,
    sub,
    sum,
    tagNaN,
    trace,
    translate,
    transpose,
    trunc,
    unitInterval,
} from '.'

import { mat, vec } from '..'

// Based on this doc: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#disallowed-merges

/*
 * Allows to perform operations like
 * ```ts
 * const r = serie1.eigenVector().mult( serie2.eigenVector() )
 * ```
 * instead of
 * ```ts
 * const r = mult( eigenVector(serie1), eigenVector(serie2) )
 * ```
 */
declare module '@youwol/dataframe/src/lib/serie' {
    interface Serie {
        abs(): Serie
        add(a: Serie | Serie[]): Serie
        cross(a: Serie): Serie
        dot(a: Serie | vec.IVector): Serie
        determinant(): Serie
        div(...a: (number | Serie)[]): Serie
        eigenValue(a: Serie): Serie
        eigenVector(a: Serie): Serie
        inv(throwOnDegenerate: boolean): Serie
        invert(): Serie
        mult(...a: (number | Serie)[]): Serie
        multMat(a: number | Serie): Serie
        negate(): Serie
        norm(): Serie
        normalize(): Serie
        rand(min: number, max: number): Serie
        rotate(rot: Serie | mat.Matrix3): Serie
        round(): Serie
        scale(t: number[] | number): Serie
        square(): Serie
        sub(...a: (number | Serie)[]): Serie
        tagNaN(
            fn: (item: number | number[], i: number, s: Serie) => boolean,
        ): Serie
        trace(): Serie
        translate(t: number[]): Serie
        transpose(): Serie
        trunc(): Serie
        unitInterval(): Serie
        //
        getNaN(): number[]
        minMax(a: Serie): number[]
        sum(): number | number[]
        closeTo(a: Serie, eps: number): boolean
        equals(a: Serie): boolean
    }
}

Serie.prototype.abs = function () {
    return abs(this)
}
Serie.prototype.add = function (b: Serie | Serie[]) {
    return Array.isArray(b) ? add([this, ...b]) : add([this, b])
}
Serie.prototype.cross = function (b: Serie) {
    return cross(this, b)
}
Serie.prototype.dot = function (b: Serie | vec.IVector) {
    return dot(this, b)
}
Serie.prototype.determinant = function () {
    return determinant(this)
}
Serie.prototype.div = function (...b: (number | Serie)[]) {
    return div(this, ...b)
}
Serie.prototype.eigenValue = function () {
    return eigenValue(this)
}
Serie.prototype.eigenVector = function () {
    return eigenVector(this)
}
Serie.prototype.getNaN = function () {
    return getNaN(this)
}
Serie.prototype.inv = function (throwOnDegenerate = false) {
    return inv(this, throwOnDegenerate)
}
Serie.prototype.invert = function () {
    return invert(this)
}
Serie.prototype.mult = function (...b: (number | Serie)[]) {
    return mult(this, ...b)
}
Serie.prototype.multMat = function (b: number | Serie) {
    return multMat(this, b)
}
Serie.prototype.negate = function () {
    return negate(this)
}
Serie.prototype.norm = function () {
    return norm(this)
}
Serie.prototype.normalize = function () {
    return normalize(this)
}
Serie.prototype.rand = function (a = 0, b = 1) {
    return rand(this, a, b)
}
Serie.prototype.rotate = function (rot: Serie | mat.Matrix3) {
    return rotate(this, rot)
}
Serie.prototype.round = function () {
    return round(this)
}
Serie.prototype.scale = function (t: number[] | number) {
    return scale(this, t)
}
Serie.prototype.square = function () {
    return square(this)
}
Serie.prototype.sub = function (...b: (number | Serie)[]) {
    return sub(this, ...b)
}
Serie.prototype.tagNaN = function (
    fn: (item: number | number[], i: number, s: Serie) => boolean,
) {
    return tagNaN(this, fn)
}
Serie.prototype.trace = function () {
    return trace(this)
}
Serie.prototype.translate = function (b: number[]) {
    return translate(this, b)
}
Serie.prototype.transpose = function () {
    return transpose(this)
}
Serie.prototype.trunc = function () {
    return trunc(this)
}
Serie.prototype.unitInterval = function () {
    return unitInterval(this)
}
//
Serie.prototype.minMax = function () {
    return minMax(this)
}
Serie.prototype.sum = function () {
    return sum(this)
}
Serie.prototype.closeTo = function (a: Serie, eps = 1e-7) {
    return closeTo(this, a, eps)
}
Serie.prototype.equals = function (a: Serie) {
    return equals(this, a)
}

export {}
