/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { cartesianProduct } from './cartesianProduct'

const small = [1, 2, 3]
const medium = Array.from({ length: 20 }, (_, i) => i)

describe('cartesianProduct', () => {
  bench('two small arrays', () => {
    cartesianProduct(small, ['a', 'b', 'c'])
  })
  bench('three small arrays (8-cube)', () => {
    cartesianProduct([0, 1], [0, 1], [0, 1])
  })
  bench('two medium arrays (20x20 = 400 tuples)', () => {
    cartesianProduct(medium, medium)
  })
})
