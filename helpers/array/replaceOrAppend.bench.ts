/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { replaceOrAppend } from './replaceOrAppend'

interface Item {
  readonly id: number
}

const large: Item[] = Array.from({ length: 10_000 }, (_, i) => ({ id: i }))

describe('replaceOrAppend', () => {
  bench('replace, match near start', () => {
    replaceOrAppend(large, { id: 5 }, x => x.id === 5)
  })
  bench('replace, match near end', () => {
    replaceOrAppend(large, { id: 9_995 }, x => x.id === 9_995)
  })
  bench('append, no match (worst case)', () => {
    replaceOrAppend(large, { id: -1 }, x => x.id === -1)
  })
})
