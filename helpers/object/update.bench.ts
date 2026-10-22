/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { update } from './update'

describe('update', () => {
  bench('existing path (fresh object per call)', () => {
    update({ count: 1 }, 'count', (n: number | undefined) => (n ?? 0) + 1)
  })
  bench('creating intermediate objects (fresh object per call)', () => {
    update({}, 'stats.hits', (n: number | undefined) => (n ?? 0) + 1)
  })
})
