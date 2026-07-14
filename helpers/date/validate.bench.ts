/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { isValidDateString } from './validate'

describe('validate', () => {
  bench('valid ISO date string', () => {
    isValidDateString('2025-01-19T12:00:00Z')
  })
  bench('invalid string', () => {
    isValidDateString('not a date')
  })
  bench('empty string (short-circuit)', () => {
    isValidDateString('')
  })
})
