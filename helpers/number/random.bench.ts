/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { randomBetween, randomIntBetween } from './random'

describe('random', () => {
  bench('randomBetween', () => {
    randomBetween(0, 100)
  })
  bench('randomIntBetween', () => {
    randomIntBetween(0, 100)
  })
})
