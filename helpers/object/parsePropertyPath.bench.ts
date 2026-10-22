/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { parsePropertyPath } from './parsePropertyPath'

describe('parsePropertyPath', () => {
  bench('simple dot path (cache hit after first call)', () => {
    parsePropertyPath('a.b.c')
  })
  bench('mixed dot/bracket path (cache hit after first call)', () => {
    parsePropertyPath('layers[1].name.value')
  })
  bench('distinct dynamic paths (cache miss every call)', () => {
    parsePropertyPath(`a.b.c.${Math.random()}`)
  })
})
