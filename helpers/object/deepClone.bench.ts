/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { deepClone } from './deepClone'

const shallow = { a: 1, b: 'hello', c: true }
const nested = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2, 3] }
const withDates = { a: new Date(), b: { c: new Date() } }
const large = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, { value: i }]))

describe('deepClone', () => {
  bench('shallow object', () => {
    deepClone(shallow)
  })
  bench('nested object (3 levels)', () => {
    deepClone(nested)
  })
  bench('object with dates', () => {
    deepClone(withDates)
  })
  bench('large object (100 keys)', () => {
    deepClone(large)
  })
  bench('array of objects', () => {
    deepClone([{ a: 1 }, { b: 2 }, { c: 3 }])
  })
  bench('null input', () => {
    deepClone(null)
  })
})
