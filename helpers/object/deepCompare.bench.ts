/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { deepCompare } from './deepCompare'

const objA = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] }
const objB = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] }
const objC = { a: 1, b: { c: 99, d: { e: 3 } }, f: [1, 2, 3], g: 'extra' }
const large = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`key${i}`, i]))

describe('deepCompare', () => {
  bench('identical objects', () => {
    deepCompare(objA, objB)
  })
  bench('objects with differences', () => {
    deepCompare(objA, objC)
  })
  bench('same reference', () => {
    deepCompare(objA, objA)
  })
  bench('null inputs', () => {
    deepCompare(null, null)
  })
  bench('large flat objects (50 keys)', () => {
    deepCompare(large, { ...large })
  })
  bench('with dates', () => {
    const d = new Date()
    deepCompare({ date: d }, { date: new Date(d.getTime()) })
  })
})
