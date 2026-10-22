/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { flip } from './flip'

const subtract = (a: number, b: number): number => a - b
const flippedSubtract = flip(subtract)

describe('flip', () => {
  bench('build a flipped function', () => {
    flip(subtract)
  })
  bench('call a pre-built flipped function', () => {
    flippedSubtract(3, 10)
  })
})
