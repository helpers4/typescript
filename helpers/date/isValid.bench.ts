/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { isValid } from './isValid'

const validDate = new Date()
const invalidDate = new Date('invalid')

describe('isValid', () => {
  bench('valid Date instance', () => {
    isValid(validDate)
  })
  bench('invalid Date instance', () => {
    isValid(invalidDate)
  })
  bench('non-Date value', () => {
    isValid('2023-01-01')
  })
})
