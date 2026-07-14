/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { parseDuration } from './parseDuration'

describe('parseDuration', () => {
  bench('single segment', () => {
    parseDuration('45s')
  })
  bench('multiple segments', () => {
    parseDuration('1h 23m 45s')
  })
  bench('unparseable string', () => {
    parseDuration('garbage')
  })
})
