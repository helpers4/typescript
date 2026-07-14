/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { sample } from './sample'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('sample', () => {
  bench('single element from small array', () => {
    sample(small)
  })
  bench('single element from large array', () => {
    sample(large)
  })
  bench('10 elements from large array (uses shuffle internally)', () => {
    sample(large, 10)
  })
})
