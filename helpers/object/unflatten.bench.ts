/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { unflatten } from './unflatten'

const small = { 'a.b.c': 1, 'a.d': 2 }
const wide: Record<string, number> = Object.fromEntries(
  Array.from({ length: 500 }, (_, i) => [`key${i}.nested.value`, i]),
)

describe('unflatten', () => {
  bench('small flattened object', () => {
    unflatten(small)
  })
  bench('wide flattened object, 500 three-level paths', () => {
    unflatten(wide)
  })
})
