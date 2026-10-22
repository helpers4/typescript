/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { omitBy } from './omitBy'

const small = { a: 1, b: undefined, c: 2 }
const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
)

describe('omitBy', () => {
  bench('small object', () => {
    omitBy(small, value => value === undefined)
  })
  bench('large object, predicate matches half', () => {
    omitBy(large, value => value % 2 === 0)
  })
})
