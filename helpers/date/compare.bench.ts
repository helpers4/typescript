/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { compare } from './compare'
import { difference } from './difference'
import { isSameDay, isSameMonth, isSameYear } from './is'

const a = new Date('2025-01-19T12:00:00Z')
const b = new Date('2025-06-15T08:30:00Z')
const same = new Date('2025-01-19T23:59:59Z')

describe('compare', () => {
  bench('before (default)', () => {
    compare(a, b)
  })
  bench('before with months precision', () => {
    compare(a, b, { precision: 'months' })
  })
  bench('before with years precision', () => {
    compare(a, b, { precision: 'years' })
  })
  bench('from string inputs', () => {
    compare('2025-01-19', '2025-06-15')
  })
})

describe('difference', () => {
  bench('days', () => {
    difference(a, b, { unit: 'days' })
  })
  bench('hours', () => {
    difference(a, b, { unit: 'hours' })
  })
  bench('milliseconds', () => {
    difference(a, b, { unit: 'milliseconds' })
  })
  bench('from string inputs', () => {
    difference('2025-01-19', '2025-06-15', { unit: 'days' })
  })
})

describe('isSameDay', () => {
  bench('same day', () => {
    isSameDay(a, same)
  })
  bench('different day', () => {
    isSameDay(a, b)
  })
})

describe('isSameMonth', () => {
  bench('same month', () => {
    isSameMonth(a, same)
  })
  bench('different month', () => {
    isSameMonth(a, b)
  })
})

describe('isSameYear', () => {
  bench('same year', () => {
    isSameYear(a, b)
  })
})
