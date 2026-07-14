/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { template } from './template'

const small = 'Hello, {{name}}! You have {{count}} messages.'
const smallData = { name: 'Alice', count: 3 }
const large = '{{greeting}} {{name}}, item {{index}}: {{value}}. '.repeat(100)
const largeData = { greeting: 'Hi', name: 'Bob', index: 1, value: 'ok' }

describe('template', () => {
  bench('small template, few placeholders', () => {
    template(small, smallData)
  })
  bench('large template, many repeated placeholders', () => {
    template(large, largeData)
  })
})
