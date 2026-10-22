/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { compare } from './compare'

describe('compare', () => {
  bench('simple core versions', () => {
    compare('1.2.3', '1.2.4')
  })
  bench('prerelease versions, multiple identifiers', () => {
    compare('1.0.0-alpha.1.2.3', '1.0.0-alpha.1.2.4')
  })
  bench('equal versions', () => {
    compare('1.2.3', '1.2.3')
  })
})
