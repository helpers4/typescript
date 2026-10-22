/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { debounce } from './debounce'

const noop = (): void => {}
const debounced = debounce(noop, 1_000)

describe('debounce', () => {
  bench('create a debounced wrapper', () => {
    debounce(noop, 1_000)
  })
  bench('call a pre-built debounced wrapper (resets the timer)', () => {
    debounced()
  })
})
