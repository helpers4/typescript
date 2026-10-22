/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { roundTo } from './roundTo'

describe('roundTo', () => {
  bench('2 decimal places', () => {
    roundTo(3.14159, 2)
  })
  bench('0 decimal places', () => {
    roundTo(3.14159, 0)
  })
})
