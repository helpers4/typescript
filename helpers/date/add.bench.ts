/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { addDays, addMonths, addYears } from './add'
import { endOf, startOf } from './startOf'

const date = new Date('2025-01-19T12:00:00Z')

describe('addDays', () => {
  bench('add 1 day', () => {
    addDays(date, 1)
  })
  bench('add 365 days', () => {
    addDays(date, 365)
  })
  bench('subtract 30 days', () => {
    addDays(date, -30)
  })
})

describe('addMonths', () => {
  bench('add 1 month', () => {
    addMonths(date, 1)
  })
  bench('add 12 months', () => {
    addMonths(date, 12)
  })
  bench('end-of-month clamping (Jan 31 + 1)', () => {
    addMonths(new Date('2025-01-31'), 1)
  })
})

describe('addYears', () => {
  bench('add 1 year', () => {
    addYears(date, 1)
  })
  bench('leap day + 1 year', () => {
    addYears(new Date('2024-02-29'), 1)
  })
})

describe('startOf', () => {
  bench('day', () => {
    startOf(date, 'day')
  })
  bench('month', () => {
    startOf(date, 'month')
  })
  bench('year', () => {
    startOf(date, 'year')
  })
})

describe('endOf', () => {
  bench('day', () => {
    endOf(date, 'day')
  })
  bench('month', () => {
    endOf(date, 'month')
  })
  bench('year', () => {
    endOf(date, 'year')
  })
})
