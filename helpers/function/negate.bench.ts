/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { negate } from './negate'

const isEven = (n: number): boolean => n % 2 === 0
const isOdd = negate(isEven)

describe('negate', () => {
  bench('build a negated predicate', () => {
    negate(isEven)
  })
  bench('call a pre-built negated predicate', () => {
    isOdd(3)
  })
})
