/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { partition } from './partition'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('partition', () => {
  bench('small array', () => {
    partition(small, n => n % 2 === 0)
  })
  bench('large array, even split', () => {
    partition(large, n => n % 2 === 0)
  })
  bench('large array, almost all pass', () => {
    partition(large, n => n !== -1)
  })
})
