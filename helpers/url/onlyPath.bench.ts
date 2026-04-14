/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { onlyPath } from './onlyPath'

describe('onlyPath', () => {
  bench('with no input', () => {
    onlyPath(undefined)
  })
  bench('with empty string', () => {
    onlyPath('')
  })
  bench('with path only', () => {
    onlyPath('/some/path')
  })
  bench('with path and query', () => {
    onlyPath('/some/path?query=thing')
  })
  bench('with path and fragment', () => {
    onlyPath('/some/path#fragment')
  })
  bench('with path, query, and fragment', () => {
    onlyPath('/some/path?query=thing#fragment')
  })
})
