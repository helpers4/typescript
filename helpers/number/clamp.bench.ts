/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { clamp } from './clamp'

describe('clamp', () => {
  bench('within range', () => {
    clamp(5, 0, 10)
  })
  bench('above max', () => {
    clamp(15, 0, 10)
  })
  bench('below min', () => {
    clamp(-5, 0, 10)
  })
})
