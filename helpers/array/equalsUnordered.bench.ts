/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { equalsUnordered } from './equalsUnordered'

const small = [1, 2, 3, 4, 5]
const smallReversed = [5, 4, 3, 2, 1]
const medium = Array.from({ length: 200 }, (_, i) => i)
const mediumShuffled = medium.toReversed()

describe('equalsUnordered', () => {
  bench('small arrays, same order', () => {
    equalsUnordered(small, small)
  })
  bench('small arrays, reversed order', () => {
    equalsUnordered(small, smallReversed)
  })
  bench('medium arrays, reversed order', () => {
    equalsUnordered(medium, mediumShuffled)
  })
})
