/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { omit } from './omit'

const small = { a: 1, b: 2, c: 3 }
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
)

describe('omit', () => {
  bench('small object, one key', () => {
    omit(small, ['b'])
  })
  bench('large object, few keys omitted', () => {
    omit(large, ['key0', 'key1', 'key2'])
  })
})
