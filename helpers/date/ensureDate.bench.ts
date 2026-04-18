/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { ensureDate } from './ensureDate'

const dateObj = new Date('2025-01-19T12:00:00Z')
const millis = 1737288000000
const seconds = 1737288000
const isoString = '2025-01-19T12:00:00Z'
const epochMs = { epochMilliseconds: 1737288000000 }

describe('ensureDate', () => {
  bench('from Date object', () => {
    ensureDate(dateObj)
  })
  bench('from milliseconds timestamp', () => {
    ensureDate(millis)
  })
  bench('from seconds timestamp', () => {
    ensureDate(seconds)
  })
  bench('from ISO string', () => {
    ensureDate(isoString)
  })
  bench('from EpochMilliseconds object', () => {
    ensureDate(epochMs)
  })
  bench('null input', () => {
    ensureDate(null)
  })
  bench('invalid string', () => {
    ensureDate('not-a-date')
  })
})
