/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { rgbToHex } from './rgbToHex'

describe('rgbToHex', () => {
  bench('opaque color', () => {
    rgbToHex({ r: 255, g: 0, b: 0 })
  })
  bench('with alpha', () => {
    rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 })
  })
  bench('out-of-range channels (clamped)', () => {
    rgbToHex({ r: 300, g: -10, b: 128.7 })
  })
})
