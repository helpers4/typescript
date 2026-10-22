/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { throttle } from './throttle'

const noop = (): void => {}
const throttled = throttle(noop, 1_000)

describe('throttle', () => {
  bench('create a throttled wrapper', () => {
    throttle(noop, 1_000)
  })
  bench('call a pre-built throttled wrapper (mostly rate-limited path)', () => {
    throttled()
  })
})
