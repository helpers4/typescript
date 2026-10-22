/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { compose } from './compose'

const addOne = (x: number): number => x + 1
const double = (x: number): number => x * 2
const toStr = (x: number): string => String(x)

const composed3 = compose(toStr, double, addOne)

describe('compose', () => {
  bench('build a 3-function composition', () => {
    compose(toStr, double, addOne)
  })
  bench('call a pre-built 3-function composition', () => {
    composed3(3)
  })
})
