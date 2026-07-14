/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { argbToRgb } from './argbToRgb'

describe('argbToRgb', () => {
  bench('opaque red', () => {
    argbToRgb(0xffff0000)
  })
  bench('semi-transparent green', () => {
    argbToRgb(0x8000ff00)
  })
})
