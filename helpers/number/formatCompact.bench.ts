/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { formatCompact } from './formatCompact'

describe('formatCompact', () => {
  bench('default locale', () => {
    formatCompact(1_500_000)
  })
  bench('explicit locale', () => {
    formatCompact(1_500_000, 'fr')
  })
})
