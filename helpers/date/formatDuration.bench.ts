/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  bench('sub-minute duration', () => {
    formatDuration(45_000)
  })
  bench('multi-hour duration', () => {
    formatDuration(5_025_000)
  })
  bench('padded, minUnit minutes', () => {
    formatDuration(5_025_000, { minUnit: 'minutes', padded: true })
  })
})
