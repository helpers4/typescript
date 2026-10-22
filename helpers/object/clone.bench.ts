/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { clone } from './clone'

const small = { a: 1, b: 2, c: 3 }
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
)
const date = new Date('2024-01-01')

describe('clone', () => {
  bench('primitive (fast path)', () => {
    clone(42)
  })
  bench('small object', () => {
    clone(small)
  })
  bench('large object (1000 keys)', () => {
    clone(large)
  })
  bench('Date instance', () => {
    clone(date)
  })
})
