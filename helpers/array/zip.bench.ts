/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { zip } from './zip'

const smallA = [1, 2, 3]
const smallB = ['a', 'b', 'c']
const largeA = Array.from({ length: 10_000 }, (_, i) => i)
const largeB = Array.from({ length: 10_000 }, (_, i) => `item-${i}`)

describe('zip', () => {
  bench('small arrays', () => {
    zip(smallA, smallB)
  })
  bench('large arrays', () => {
    zip(largeA, largeB)
  })
})
