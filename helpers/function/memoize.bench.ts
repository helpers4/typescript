/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { memoize } from './memoize'

const add = (a: number, b: number) => a + b
const memoizedAdd = memoize(add)

describe('memoize', () => {
  bench('cache miss', () => {
    const fn = memoize(add)
    fn(1, 2)
  })
  bench('cache hit', () => {
    memoizedAdd(1, 2)
  })
  bench('varying arguments', () => {
    const fn = memoize(add)
    fn(1, 2)
    fn(3, 4)
    fn(1, 2)
  })
})
