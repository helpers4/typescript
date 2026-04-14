/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { kebabCase } from './kebabCase'

describe('kebabCase', () => {
  bench('simple camelCase', () => {
    kebabCase('helloWorld')
  })
  bench('multiple segments', () => {
    kebabCase('myLongVariableName')
  })
  bench('already kebab-case', () => {
    kebabCase('hello-world')
  })
  bench('single word', () => {
    kebabCase('hello')
  })
})
