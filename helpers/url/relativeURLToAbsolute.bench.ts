/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { relativeURLToAbsolute } from './relativeURLToAbsolute'

describe('relativeURLToAbsolute', () => {
  bench('with simple relative path', () => {
    relativeURLToAbsolute('/some/path')
  })
  bench('with nested relative path', () => {
    relativeURLToAbsolute('/some/deep/nested/path')
  })
  bench('with trailing slash', () => {
    relativeURLToAbsolute('/some/path/')
  })
  bench('without leading slash', () => {
    relativeURLToAbsolute('some/path')
  })
})
