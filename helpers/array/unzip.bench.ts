/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { unzip } from './unzip'

const small: [number, string][] = [[1, 'a'], [2, 'b'], [3, 'c']]
const large: [number, string][] = Array.from({ length: 10_000 }, (_, i) => [i, `item-${i}`])

describe('unzip', () => {
  bench('small array of pairs', () => {
    unzip(small)
  })
  bench('large array of pairs', () => {
    unzip(large)
  })
})
