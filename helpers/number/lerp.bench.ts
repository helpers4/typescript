/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { lerp } from './lerp'

describe('lerp', () => {
  bench('t = 0.5', () => {
    lerp(0, 100, 0.5)
  })
  bench('t = 0 (fast path)', () => {
    lerp(0, 100, 0)
  })
})
