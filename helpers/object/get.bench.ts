/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { get } from './get'

const obj = { a: { b: { c: 42 } } }
const withArray = { layers: [{ name: 'bg' }, { name: 'fg' }] }

describe('get', () => {
  bench('shallow key array path', () => {
    get(obj, ['a', 'b', 'c'])
  })
  bench('dot-notation string path (parsed + cached)', () => {
    get(obj, 'a.b.c')
  })
  bench('bracket-notation path into array', () => {
    get(withArray, 'layers[1].name')
  })
  bench('missing path with default', () => {
    get(obj, 'x.y.z', 'default')
  })
})
