/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { removeDiacritics } from './removeDiacritics'

const short = 'café'
const plainAscii = 'hello world, nothing to strip here'
const long = 'café naïve résumé ÉCOLE piñata jalapeño '.repeat(100)

describe('removeDiacritics', () => {
  bench('short string with diacritics', () => {
    removeDiacritics(short)
  })
  bench('plain ASCII, nothing to strip', () => {
    removeDiacritics(plainAscii)
  })
  bench('long string with many diacritics', () => {
    removeDiacritics(long)
  })
})
