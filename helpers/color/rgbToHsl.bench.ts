/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { rgbToHsl } from './rgbToHsl'

describe('rgbToHsl', () => {
  bench('red', () => {
    rgbToHsl({ r: 255, g: 0, b: 0 })
  })
  bench('with alpha', () => {
    rgbToHsl({ r: 0, g: 128, b: 255, a: 0.5 })
  })
  bench('grayscale (r === g === b)', () => {
    rgbToHsl({ r: 128, g: 128, b: 128 })
  })
})
