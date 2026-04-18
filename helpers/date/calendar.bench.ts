/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { daysInMonth, isLeapYear } from './calendar'
import { isValidDateString } from './validate'
import { isBusinessDay, isWeekend } from './weekday'

const saturday = new Date('2025-01-18')
const monday = new Date('2025-01-13')

describe('isLeapYear', () => {
  bench('leap year (2024)', () => {
    isLeapYear(2024)
  })
  bench('non-leap year (2025)', () => {
    isLeapYear(2025)
  })
  bench('century leap (2000)', () => {
    isLeapYear(2000)
  })
  bench('century non-leap (1900)', () => {
    isLeapYear(1900)
  })
})

describe('daysInMonth', () => {
  bench('January', () => {
    daysInMonth(2025, 1)
  })
  bench('February (leap)', () => {
    daysInMonth(2024, 2)
  })
  bench('February (non-leap)', () => {
    daysInMonth(2025, 2)
  })
})

describe('isWeekend', () => {
  bench('Saturday (default)', () => {
    isWeekend(saturday)
  })
  bench('Monday (default)', () => {
    isWeekend(monday)
  })
  bench('custom weekendDays [5, 6]', () => {
    isWeekend(saturday, [5, 6])
  })
})

describe('isBusinessDay', () => {
  bench('Monday (default)', () => {
    isBusinessDay(monday)
  })
  bench('Saturday (default)', () => {
    isBusinessDay(saturday)
  })
})

describe('isValidDateString', () => {
  bench('valid ISO', () => {
    isValidDateString('2025-01-19T12:00:00Z')
  })
  bench('valid informal', () => {
    isValidDateString('Jan 19, 2025')
  })
  bench('invalid', () => {
    isValidDateString('not a date')
  })
  bench('empty', () => {
    isValidDateString('')
  })
})
