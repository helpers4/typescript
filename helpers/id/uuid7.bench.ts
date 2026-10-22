/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { uuid7 } from './uuid7'

describe('uuid7', () => {
  bench('generate a single UUID v7', () => {
    uuid7()
  })
})
