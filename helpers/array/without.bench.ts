/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { without } from './without'

const small = [1, 2, 3, 2, 4]
const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('without', () => {
  bench('small array, one value', () => {
    without(small, 2)
  })
  bench('large array, one value', () => {
    without(large, 5_000)
  })
  bench('large array, many values', () => {
    without(large, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
  })
})
