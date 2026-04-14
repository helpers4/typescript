/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { camelCase } from './camelCase'

describe('camelCase', () => {
  bench('simple kebab-case', () => {
    camelCase('hello-world')
  })
  bench('multiple segments', () => {
    camelCase('my-long-variable-name')
  })
  bench('already camelCase', () => {
    camelCase('helloWorld')
  })
  bench('single word', () => {
    camelCase('hello')
  })
})
