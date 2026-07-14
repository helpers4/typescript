/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { invert } from './invert'

const small = { a: 'x', b: 'y', c: 'z' }
const large: Record<string, string> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, `value${i}`]),
)

describe('invert', () => {
  bench('small object', () => {
    invert(small)
  })
  bench('large object (1000 keys)', () => {
    invert(large)
  })
})
