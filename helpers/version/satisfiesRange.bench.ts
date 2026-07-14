/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { satisfiesRange } from './satisfiesRange'

describe('satisfiesRange', () => {
  bench('exact match', () => {
    satisfiesRange('1.2.3', '1.2.3')
  })
  bench('>= comparator', () => {
    satisfiesRange('1.5.0', '>=1.0.0')
  })
  bench('caret range', () => {
    satisfiesRange('1.5.0', '^1.0.0')
  })
})
