/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { formatSize } from './formatSize'

describe('formatSize', () => {
  bench('bytes (no division)', () => {
    formatSize(512)
  })
  bench('gigabytes (3 divisions)', () => {
    formatSize(1_073_741_824)
  })
})
