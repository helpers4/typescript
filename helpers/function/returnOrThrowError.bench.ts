/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { returnOrThrowError } from './returnOrThrowError'

describe('returnOrThrowError', () => {
  bench('defined value (fast path)', () => {
    returnOrThrowError(42, 'should not throw')
  })
  bench('nullish value (throw + catch)', () => {
    try {
      returnOrThrowError(null, 'value is required')
    } catch {
      // expected
    }
  })
})
