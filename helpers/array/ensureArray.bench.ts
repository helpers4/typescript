/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { ensureArray } from './ensureArray'

const nested = Array.from({ length: 1_000 }, (_, i) => [i, [i + 1]])

describe('ensureArray', () => {
  bench('already an array (identity path)', () => {
    ensureArray([1, 2, 3])
  })
  bench('single value wrapped', () => {
    ensureArray('hello')
  })
  bench('nested array flattened to depth 1', () => {
    ensureArray(nested, 1)
  })
})
