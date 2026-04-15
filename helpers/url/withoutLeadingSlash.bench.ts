/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { withoutLeadingSlash } from './withoutLeadingSlash'

describe('withoutLeadingSlash', () => {
  bench('with no input', () => {
    withoutLeadingSlash(undefined)
  })
  bench('with empty string', () => {
    withoutLeadingSlash('')
  })
  bench('with leading slash', () => {
    withoutLeadingSlash('/some/path')
  })
  bench('without leading slash', () => {
    withoutLeadingSlash('some/path')
  })
})
