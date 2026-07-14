/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { set } from './set'

describe('set', () => {
  bench('shallow key array path, existing structure', () => {
    set({ a: { b: { c: 1 } } }, ['a', 'b', 'c'], 42)
  })
  bench('dot-notation path, existing structure', () => {
    set({ a: { b: { c: 1 } } }, 'a.b.c', 42)
  })
  bench('dot-notation path, creating intermediate objects', () => {
    set({}, 'a.b.c.d.e', 42)
  })
  bench('bracket-notation path into existing array', () => {
    set({ layers: [{ name: 'bg' }, { name: 'fg' }] }, 'layers[1].name', 'updated')
  })
})
