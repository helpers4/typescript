/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { pipe } from './pipe'

const addOne = (x: number): number => x + 1
const double = (x: number): number => x * 2
const toStr = (x: number): string => String(x)

const piped3 = pipe(addOne, double, toStr)

describe('pipe', () => {
  bench('build a 3-function pipeline', () => {
    pipe(addOne, double, toStr)
  })
  bench('call a pre-built 3-function pipeline', () => {
    piped3(3)
  })
})
