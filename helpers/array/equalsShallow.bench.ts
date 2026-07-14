/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { equalsShallow } from './equalsShallow'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)
const largeCopy = [...large]
const largeDiffLast = [...large.slice(0, -1), -1]

describe('equalsShallow', () => {
  bench('same reference (fast path)', () => {
    equalsShallow(large, large)
  })
  bench('small arrays, equal', () => {
    equalsShallow(small, [1, 2, 3, 4, 5])
  })
  bench('large arrays, equal values', () => {
    equalsShallow(large, largeCopy)
  })
  bench('large arrays, differ at last index (worst case)', () => {
    equalsShallow(large, largeDiffLast)
  })
})
