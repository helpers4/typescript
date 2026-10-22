/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { equalsDeep } from './equalsDeep'

const small = [1, 2, 3]
const medium = Array.from({ length: 100 }, (_, i) => i)
const nested = [[1, 2], [3, [4, 5]], [6, [7, [8, 9]]]]
const nestedCopy = [[1, 2], [3, [4, 5]], [6, [7, [8, 9]]]]

describe('equalsDeep', () => {
  bench('small equal arrays', () => {
    equalsDeep(small, [1, 2, 3])
  })
  bench('small different arrays', () => {
    equalsDeep(small, [1, 2, 4])
  })
  bench('medium equal arrays (100 items)', () => {
    equalsDeep(medium, Array.from({ length: 100 }, (_, i) => i))
  })
  bench('nested arrays (3 levels)', () => {
    equalsDeep(nested, nestedCopy)
  })
  bench('same reference', () => {
    equalsDeep(small, small)
  })
  bench('different lengths', () => {
    equalsDeep(small, [1, 2])
  })
})
