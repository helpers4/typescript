/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { hexToRgb } from './hexToRgb'

describe('hexToRgb', () => {
  bench('short hex (#rgb)', () => {
    hexToRgb('#f00')
  })
  bench('long hex (#rrggbb)', () => {
    hexToRgb('#ff0000')
  })
  bench('long hex with alpha (#rrggbbaa)', () => {
    hexToRgb('#ff000080')
  })
})
