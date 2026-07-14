/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { truncate } from './truncate'

const short = 'Hi'
const long = 'Hello, world! '.repeat(200)

describe('truncate', () => {
  bench('already within limit (no-op path)', () => {
    truncate(short, 10)
  })
  bench('long string, truncated', () => {
    truncate(long, 50)
  })
})
