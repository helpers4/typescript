/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { toISO8601, toRFC2822, toRFC3339 } from './format'
import { formatDuration } from './formatDuration'
import { timeAgo } from './timeAgo'

const date = new Date('2025-01-19T12:00:00Z')
const now = new Date('2025-01-19T14:30:00Z')

describe('toISO8601', () => {
  bench('from Date', () => {
    toISO8601(date)
  })
  bench('from string', () => {
    toISO8601('2025-01-19T12:00:00Z')
  })
})

describe('toRFC3339', () => {
  bench('without millis', () => {
    toRFC3339(date)
  })
  bench('with millis', () => {
    toRFC3339(date, true)
  })
})

describe('toRFC2822', () => {
  bench('from Date', () => {
    toRFC2822(date)
  })
})

describe('timeAgo', () => {
  bench('2.5 hours ago', () => {
    timeAgo(date, { now })
  })
  bench('30 days ago', () => {
    timeAgo(new Date('2024-12-20'), { now })
  })
  bench('with locale fr', () => {
    timeAgo(date, { now, locale: 'fr' })
  })
})

describe('formatDuration', () => {
  bench('1h 23m 45s', () => {
    formatDuration(5025000)
  })
  bench('sub-second', () => {
    formatDuration(450)
  })
  bench('zero', () => {
    formatDuration(0)
  })
  bench('padded', () => {
    formatDuration(5025000, { padded: true })
  })
  bench('large (days)', () => {
    formatDuration(90061000)
  })
})
