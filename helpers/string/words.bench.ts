/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { words } from './words'

const plain = 'hello world'
const camel = 'thisIsAVeryLongCamelCaseIdentifierNameForTesting'
const long = 'someCamelCase snake_case kebab-case SCREAMING_SNAKE foo123bar '.repeat(50)

describe('words', () => {
  bench('plain whitespace-separated text', () => {
    words(plain)
  })
  bench('single long camelCase identifier', () => {
    words(camel)
  })
  bench('long mixed-case text', () => {
    words(long)
  })
})
