/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { groupBy } from './groupBy'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('groupBy', () => {
  bench('small array, few groups', () => {
    groupBy(small, n => (n % 2 === 0 ? 'even' : 'odd'))
  })
  bench('large array, few groups', () => {
    groupBy(large, n => (n % 2 === 0 ? 'even' : 'odd'))
  })
  bench('large array, many groups', () => {
    groupBy(large, n => String(n % 1000))
  })
})
