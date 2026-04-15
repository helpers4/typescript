/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { deepMerge } from './deepMerge'

const flat = { a: 1, b: 2, c: 3 }
const nested = { a: { b: { c: 1 } }, d: { e: 2 } }
const override = { a: { b: { c: 99 } }, d: { e: 88, f: 77 } }

describe('deepMerge', () => {
  bench('flat objects', () => {
    deepMerge({ ...flat }, { d: 4, e: 5 })
  })
  bench('nested objects (3 levels)', () => {
    deepMerge({ ...nested, a: { ...nested.a, b: { ...nested.a.b } }, d: { ...nested.d } }, override)
  })
  bench('multiple sources', () => {
    deepMerge({ ...flat }, { d: 4 }, { e: 5 }, { f: 6 })
  })
  bench('no sources', () => {
    deepMerge({ ...flat })
  })
})
