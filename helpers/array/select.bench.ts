/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { select } from './select'

const large = Array.from({ length: 10_000 }, (_, i) => i)

describe('select', () => {
  bench('map only (no condition)', () => {
    select(large, x => x * 2)
  })
  bench('filter + map, half pass', () => {
    select(large, x => x * 2, x => x % 2 === 0)
  })
})
