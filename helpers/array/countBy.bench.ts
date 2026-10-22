/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { countBy } from './countBy'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('countBy', () => {
  bench('small array, few keys', () => {
    countBy(small, n => (n % 2 === 0 ? 'even' : 'odd'))
  })
  bench('large array, few keys', () => {
    countBy(large, n => (n % 2 === 0 ? 'even' : 'odd'))
  })
  bench('large array, many keys', () => {
    countBy(large, n => String(n % 1000))
  })
})
