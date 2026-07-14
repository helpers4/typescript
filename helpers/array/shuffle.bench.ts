/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { shuffle } from './shuffle'

const small = [1, 2, 3, 4, 5]
const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('shuffle', () => {
  bench('small array', () => {
    shuffle(small)
  })
  bench('large array', () => {
    shuffle(large)
  })
})
