/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { increment } from './increment'

describe('increment', () => {
  bench('patch bump', () => {
    increment('1.2.3', 'patch')
  })
  bench('major bump, with leading v', () => {
    increment('v1.2.3', 'major')
  })
})
