/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { flatten } from './flatten'

const small = { a: { b: { c: 1 }, d: 2 } }
const wide: Record<string, unknown> = Object.fromEntries(
  Array.from({ length: 500 }, (_, i) => [`key${i}`, { nested: { value: i } }]),
)

describe('flatten', () => {
  bench('small nested object', () => {
    flatten(small)
  })
  bench('wide object, 500 two-level entries', () => {
    flatten(wide)
  })
})
