/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { extractPureURI } from './extractPureURI'

describe('extractPureURI', () => {
  bench('with no input', () => {
    extractPureURI(undefined)
  })
  bench('with empty string', () => {
    extractPureURI('')
  })
  bench('with path only', () => {
    extractPureURI('/some/path')
  })
  bench('with query string', () => {
    extractPureURI('/some/path?query=thing')
  })
  bench('with fragment', () => {
    extractPureURI('/some/path#fragment')
  })
  bench('with query and fragment', () => {
    extractPureURI('/some/path?query=thing#fragment')
  })
  bench('with full URL', () => {
    extractPureURI('https://example.com/some/path?query=thing#fragment')
  })
})
