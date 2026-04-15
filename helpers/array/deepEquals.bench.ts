/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { deepEquals } from './deepEquals'

const small = [1, 2, 3]
const medium = Array.from({ length: 100 }, (_, i) => i)
const nested = [[1, 2], [3, [4, 5]], [6, [7, [8, 9]]]]
const nestedCopy = [[1, 2], [3, [4, 5]], [6, [7, [8, 9]]]]

describe('deepEquals', () => {
  bench('small equal arrays', () => {
    deepEquals(small, [1, 2, 3])
  })
  bench('small different arrays', () => {
    deepEquals(small, [1, 2, 4])
  })
  bench('medium equal arrays (100 items)', () => {
    deepEquals(medium, Array.from({ length: 100 }, (_, i) => i))
  })
  bench('nested arrays (3 levels)', () => {
    deepEquals(nested, nestedCopy)
  })
  bench('same reference', () => {
    deepEquals(small, small)
  })
  bench('different lengths', () => {
    deepEquals(small, [1, 2])
  })
})
