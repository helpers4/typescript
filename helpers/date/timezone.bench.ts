/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { formatInTimezone, getTimezoneOffset, listTimezones } from './timezone'

const date = new Date('2025-01-19T12:00:00Z')

describe('listTimezones', () => {
  bench('list all', () => {
    listTimezones()
  })
})

describe('getTimezoneOffset', () => {
  bench('UTC', () => {
    getTimezoneOffset('UTC', date)
  })
  bench('America/New_York', () => {
    getTimezoneOffset('America/New_York', date)
  })
  bench('Asia/Kolkata (half-hour)', () => {
    getTimezoneOffset('Asia/Kolkata', date)
  })
})

describe('formatInTimezone', () => {
  bench('default options', () => {
    formatInTimezone(date, 'America/New_York')
  })
  bench('with locale fr-FR', () => {
    formatInTimezone(date, 'Europe/Paris', { locale: 'fr-FR' })
  })
  bench('with full format options', () => {
    formatInTimezone(date, 'Asia/Tokyo', {
      locale: 'ja-JP',
      formatOptions: { dateStyle: 'full', timeStyle: 'long' },
    })
  })
})
