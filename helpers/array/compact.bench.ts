/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { compact } from './compact'

const small = [0, 1, false, 2, '', 3, null, undefined, Number.NaN]
const large = Array.from({ length: 10_000 }, (_, i) => (i % 3 === 0 ? 0 : i))

describe('compact', () => {
  bench('small mixed-falsy array', () => {
    compact(small)
  })
  bench('large array, 1/3 falsy', () => {
    compact(large)
  })
})
