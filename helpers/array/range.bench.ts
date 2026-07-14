/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { range } from './range'

describe('range', () => {
  bench('small range (0-5)', () => {
    range(5)
  })
  bench('large range (10,000 steps)', () => {
    range(0, 10_000)
  })
  bench('large range with step', () => {
    range(0, 10_000, 2)
  })
})
