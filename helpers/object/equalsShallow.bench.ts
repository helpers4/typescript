/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { equalsShallow } from './equalsShallow'

const small = { a: 1, b: 2, c: 3 }
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
)
const largeCopy = { ...large }
const largeDiffLast = { ...large, key999: -1 }

describe('equalsShallow', () => {
  bench('same reference (fast path)', () => {
    equalsShallow(large, large)
  })
  bench('small objects, equal', () => {
    equalsShallow(small, { a: 1, b: 2, c: 3 })
  })
  bench('large objects, equal values', () => {
    equalsShallow(large, largeCopy)
  })
  bench('large objects, differ at last key', () => {
    equalsShallow(large, largeDiffLast)
  })
})
