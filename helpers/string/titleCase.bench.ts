/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { titleCase } from './titleCase'

describe('titleCase', () => {
  bench('simple string', () => {
    titleCase('hello world')
  })
  bench('from kebab-case', () => {
    titleCase('hello-world-foo')
  })
  bench('already title case', () => {
    titleCase('Hello World')
  })
  bench('long string', () => {
    titleCase('the quick brown fox jumps over the lazy dog')
  })
})
