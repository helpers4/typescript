/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { difference } from './difference'

const dateA = new Date('2025-01-01T00:00:00Z')
const dateB = new Date('2025-06-15T12:00:00Z')
const stringA = '2025-01-01T00:00:00Z'
const stringB = '2025-06-15T12:00:00Z'

describe('difference', () => {
  bench('Date instances, default unit (days)', () => {
    difference(dateA, dateB)
  })
  bench('date strings (parses via ensureDate)', () => {
    difference(stringA, stringB)
  })
  bench('Date instances, hours unit', () => {
    difference(dateA, dateB, { unit: 'hours' })
  })
})
