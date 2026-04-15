/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { pascalCase } from './pascalCase'

describe('pascalCase', () => {
  bench('from kebab-case', () => {
    pascalCase('hello-world')
  })
  bench('multiple segments', () => {
    pascalCase('my-long-variable-name')
  })
  bench('already PascalCase', () => {
    pascalCase('HelloWorld')
  })
  bench('single word', () => {
    pascalCase('hello')
  })
})
