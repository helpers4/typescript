/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, bench } from 'vitest'

import { snakeCase } from './snakeCase'

describe('snakeCase', () => {
  bench('from camelCase', () => {
    snakeCase('helloWorld')
  })
  bench('multiple segments', () => {
    snakeCase('myLongVariableName')
  })
  bench('already snake_case', () => {
    snakeCase('hello_world')
  })
  bench('single word', () => {
    snakeCase('hello')
  })
})
