/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { once } from './once'

const expensiveSetup = (): number => 42
const wrapped = once(expensiveSetup)
wrapped()

describe('once', () => {
  bench('create a once-wrapped function', () => {
    once(expensiveSetup)
  })
  bench('call after first invocation (cached path)', () => {
    wrapped()
  })
})
