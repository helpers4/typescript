/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { unset } from './unset'

describe('unset', () => {
  bench('existing path (fresh object per call)', () => {
    unset({ a: { b: 1, c: 2 } }, 'a.b')
  })
  bench('missing intermediate path (no-op, shared object)', () => {
    const shared = { a: { b: 1 } }
    unset(shared, 'x.y.z')
  })
})
