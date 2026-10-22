/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { equalsDeep } from './equalsDeep'

const small = { a: 1, b: { c: 2 } }
const nested = {
  a: Array.from({ length: 100 }, (_, i) => ({ id: i, tags: ['x', 'y'] })),
}
const nestedCopy = structuredClone(nested)
const nestedDiffLast = structuredClone(nested)
nestedDiffLast.a[nestedDiffLast.a.length - 1].id = -1

describe('equalsDeep', () => {
  bench('small nested objects, equal', () => {
    equalsDeep(small, { a: 1, b: { c: 2 } })
  })
  bench('large nested objects, equal', () => {
    equalsDeep(nested, nestedCopy)
  })
  bench('large nested objects, differ at last element', () => {
    equalsDeep(nested, nestedDiffLast)
  })
})
