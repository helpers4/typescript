/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { createSortByStringFn, sortNumberAscFn, sortStringAscFn } from './sort'

const numbers = [5, 3, 8, 1, 9, 2, 7, 4, 6, 10]
const strings = ['banana', 'apple', 'cherry', 'date', 'elderberry', 'fig', 'grape']
const objects = Array.from({ length: 50 }, (_, i) => ({ label: `item-${50 - i}`, value: 50 - i }))
const sortByLabel = createSortByStringFn<{ label: string; value: number }>('label')

describe('sort', () => {
  bench('numbers ascending (10 items)', () => {
    [...numbers].sort(sortNumberAscFn)
  })
  bench('strings ascending (7 items)', () => {
    [...strings].sort(sortStringAscFn)
  })
  bench('objects by string property (50 items)', () => {
    [...objects].sort(sortByLabel)
  })
})
