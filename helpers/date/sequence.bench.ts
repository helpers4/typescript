/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { eachDay, eachMonth } from './sequence'

describe('sequence', () => {
  bench('eachDay, one week', () => {
    eachDay('2025-01-01', '2025-01-07')
  })
  bench('eachDay, one year (365 entries)', () => {
    eachDay('2025-01-01', '2025-12-31')
  })
  bench('eachMonth, one year', () => {
    eachMonth('2025-01-01', '2025-12-31')
  })
})
