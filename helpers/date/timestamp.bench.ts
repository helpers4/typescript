/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import {
  fromMillis,
  fromSeconds,
  isTimestampInSeconds,
  normalizeTimestamp,
  toMillis,
  toSeconds,
} from './timestamp'

const dateObj = new Date('2025-01-19T12:00:00Z')
const seconds = 1737288000
const millis = 1737288000000

describe('isTimestampInSeconds', () => {
  bench('seconds-range', () => {
    isTimestampInSeconds(seconds)
  })
  bench('millis-range', () => {
    isTimestampInSeconds(millis)
  })
  bench('negative seconds', () => {
    isTimestampInSeconds(-seconds)
  })
})

describe('normalizeTimestamp', () => {
  bench('from seconds', () => {
    normalizeTimestamp(seconds)
  })
  bench('from millis (no-op)', () => {
    normalizeTimestamp(millis)
  })
})

describe('toSeconds', () => {
  bench('from Date', () => {
    toSeconds(dateObj)
  })
  bench('from ISO string', () => {
    toSeconds('2025-01-19T12:00:00Z')
  })
})

describe('toMillis', () => {
  bench('from Date', () => {
    toMillis(dateObj)
  })
  bench('from ISO string', () => {
    toMillis('2025-01-19T12:00:00Z')
  })
})

describe('fromSeconds', () => {
  bench('positive', () => {
    fromSeconds(seconds)
  })
  bench('zero', () => {
    fromSeconds(0)
  })
  bench('negative', () => {
    fromSeconds(-seconds)
  })
})

describe('fromMillis', () => {
  bench('positive', () => {
    fromMillis(millis)
  })
  bench('zero', () => {
    fromMillis(0)
  })
})
