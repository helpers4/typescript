/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { timeAgo } from './timeAgo'

const now = new Date('2025-06-15T12:00:00Z')
const secondsAgo = new Date('2025-06-15T11:59:30Z')
const yearsAgo = new Date('2020-01-01T00:00:00Z')

describe('timeAgo', () => {
  bench('seconds ago', () => {
    timeAgo(secondsAgo, { now })
  })
  bench('years ago', () => {
    timeAgo(yearsAgo, { now })
  })
  bench('with explicit locale', () => {
    timeAgo(yearsAgo, { now, locale: 'fr' })
  })
})
