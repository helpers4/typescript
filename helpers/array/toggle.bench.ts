/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { toggle } from './toggle'

interface Item {
  readonly id: number
}

const large: Item[] = Array.from({ length: 10_000 }, (_, i) => ({ id: i }))

describe('toggle', () => {
  bench('remove existing item (reference equality)', () => {
    toggle(large, large[5])
  })
  bench('add new item (reference equality)', () => {
    toggle(large, { id: -1 })
  })
  bench('toggle by derived key', () => {
    toggle(large, { id: 5 }, x => x.id)
  })
})
