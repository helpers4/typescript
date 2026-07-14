/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { capitalize } from './capitalize'

const short = 'hello'
const long = 'hELLO '.repeat(200)

describe('capitalize', () => {
  bench('short string, default options', () => {
    capitalize(short)
  })
  bench('long string, default options', () => {
    capitalize(long)
  })
  bench('short string, lowercaseRest: false', () => {
    capitalize(short, { lowercaseRest: false })
  })
})
