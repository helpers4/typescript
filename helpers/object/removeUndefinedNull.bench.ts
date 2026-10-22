/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { removeUndefinedNull } from './removeUndefinedNull'

const small = { a: 1, b: null, c: undefined, d: 'hello' }
const large: Record<string, number | null | undefined> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i % 3 === 0 ? null : i]),
)

describe('removeUndefinedNull', () => {
  bench('small object', () => {
    removeUndefinedNull(small)
  })
  bench('large object, 1/3 null', () => {
    removeUndefinedNull(large)
  })
})
