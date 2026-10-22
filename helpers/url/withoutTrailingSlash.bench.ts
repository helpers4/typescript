/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { withoutTrailingSlash } from './withoutTrailingSlash'

describe('withoutTrailingSlash', () => {
  bench('with no input', () => {
    withoutTrailingSlash(undefined)
  })
  bench('with empty string', () => {
    withoutTrailingSlash('')
  })
  bench('with trailing slash', () => {
    withoutTrailingSlash('some/path/')
  })
  bench('without trailing slash', () => {
    withoutTrailingSlash('some/path')
  })
})
