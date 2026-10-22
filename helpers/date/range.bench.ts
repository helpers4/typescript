/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { clampDate, isWithinRange, overlaps } from './range'
import { eachDay, eachMonth } from './sequence'

const start = new Date('2025-01-01')
const end = new Date('2025-01-31')
const mid = new Date('2025-01-15')
const outside = new Date('2025-06-15')

const rangeA = { start: new Date('2025-01-01'), end: new Date('2025-01-31') }
const rangeB = { start: new Date('2025-01-15'), end: new Date('2025-02-15') }
const rangeC = { start: new Date('2025-03-01'), end: new Date('2025-03-31') }

describe('isWithinRange', () => {
  bench('inside', () => {
    isWithinRange(mid, start, end)
  })
  bench('outside', () => {
    isWithinRange(outside, start, end)
  })
  bench('boundary', () => {
    isWithinRange(start, start, end)
  })
})

describe('clampDate', () => {
  bench('already within', () => {
    clampDate(mid, start, end)
  })
  bench('clamp up', () => {
    clampDate(new Date('2024-12-01'), start, end)
  })
})

describe('overlaps', () => {
  bench('overlapping ranges', () => {
    overlaps(rangeA, rangeB)
  })
  bench('non-overlapping ranges', () => {
    overlaps(rangeA, rangeC)
  })
})

describe('eachDay', () => {
  bench('7 days', () => {
    eachDay(new Date('2025-01-01'), new Date('2025-01-07'))
  })
  bench('31 days', () => {
    eachDay(start, end)
  })
  bench('90 days', () => {
    eachDay(new Date('2025-01-01'), new Date('2025-03-31'))
  })
})

describe('eachMonth', () => {
  bench('6 months', () => {
    eachMonth(new Date('2025-01-01'), new Date('2025-06-30'))
  })
  bench('12 months', () => {
    eachMonth(new Date('2025-01-01'), new Date('2025-12-31'))
  })
})
