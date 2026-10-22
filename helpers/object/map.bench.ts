/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { map } from './map'

const large: Record<string, number> = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i]),
)

describe('map', () => {
  bench('map values only', () => {
    map(large, v => v * 2)
  })
  bench('map keys only', () => {
    map(large, undefined, k => k.toUpperCase())
  })
  bench('map keys and values', () => {
    map(large, v => v * 2, k => k.toUpperCase())
  })
})
