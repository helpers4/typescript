/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { unary } from './unary'

const unaryParseInt = unary(parseInt)

describe('unary', () => {
  bench('build a unary-restricted function', () => {
    unary(parseInt)
  })
  bench('call a pre-built unary-restricted function', () => {
    unaryParseInt('42')
  })
})
