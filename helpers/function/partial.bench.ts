/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { partial } from './partial'

const multiply = (a: number, b: number): number => a * b
const double = partial(multiply, 2)

describe('partial', () => {
  bench('build a partially-applied function', () => {
    partial(multiply, 2)
  })
  bench('call a pre-built partially-applied function', () => {
    double(5)
  })
})
