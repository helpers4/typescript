/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { escapeRegExp } from './escapeRegExp'

const short = '1 + 1 = 2?'
const plain = 'no special characters here at all'
const long = '(a.b)*+c[d]?'.repeat(200)

describe('escapeRegExp', () => {
  bench('short string with metacharacters', () => {
    escapeRegExp(short)
  })
  bench('plain string, nothing to escape', () => {
    escapeRegExp(plain)
  })
  bench('long string with many metacharacters', () => {
    escapeRegExp(long)
  })
})
