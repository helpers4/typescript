/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { compact } from './compact'

const small = { a: 1, b: null, c: '', d: 0, e: 'hello' }
const large: Record<string, unknown> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i % 3 === 0 ? 0 : i]),
)

describe('compact', () => {
  bench('small mixed-falsy object', () => {
    compact(small)
  })
  bench('large object, 1/3 falsy', () => {
    compact(large)
  })
})
