/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { chunk } from './chunk'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('chunk', () => {
  bench('small array, size 2', () => {
    chunk(small, 2)
  })
  bench('large array, size 10', () => {
    chunk(large, 10)
  })
  bench('large array, size 1000', () => {
    chunk(large, 1000)
  })
})
