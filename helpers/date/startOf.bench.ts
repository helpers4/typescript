/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { startOf } from './startOf'

const date = new Date('2025-06-15T14:30:00Z')

describe('startOf', () => {
  bench('start of day', () => {
    startOf(date, 'day')
  })
  bench('start of month', () => {
    startOf(date, 'month')
  })
  bench('start of year', () => {
    startOf(date, 'year')
  })
})
