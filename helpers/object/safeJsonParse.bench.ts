/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { safeJsonParse } from './safeJsonParse'

const smallJson = '{"a":1,"b":2}'
const largeJson = JSON.stringify(
  Object.fromEntries(Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i])),
)
const invalidJson = '{invalid'

describe('safeJsonParse', () => {
  bench('small valid JSON', () => {
    safeJsonParse(smallJson)
  })
  bench('large valid JSON (1000 keys)', () => {
    safeJsonParse(largeJson)
  })
  bench('invalid JSON (throw + catch path)', () => {
    safeJsonParse(invalidJson, {})
  })
})
