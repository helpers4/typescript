/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { hslToRgb } from './hslToRgb'

describe('hslToRgb', () => {
  bench('red', () => {
    hslToRgb({ h: 0, s: 100, l: 50 })
  })
  bench('with alpha', () => {
    hslToRgb({ h: 210, s: 50, l: 40, a: 0.5 })
  })
  bench('negative hue (wraps)', () => {
    hslToRgb({ h: -30, s: 80, l: 60 })
  })
})
