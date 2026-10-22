/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { inRange } from './inRange'

describe('inRange', () => {
  bench('default inclusive both', () => {
    inRange(5, 1, 10)
  })
  bench('exclusive boundaries', () => {
    inRange(5, 1, 10, { inclusive: 'none' })
  })
})
