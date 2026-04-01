/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { withTrailingSlash } from 'radashi'

describe('withTrailingSlash', () => {
  bench('with no input', () => {
    withTrailingSlash(undefined)
  })
  bench('with empty string', () => {
    withTrailingSlash('')
  })
  bench('with missing trailing slash', () => {
    withTrailingSlash('some/path')
  })
  bench('with trailing slash', () => {
    withTrailingSlash('some/path/')
  })
})
