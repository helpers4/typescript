/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { slugify } from './slugify'

describe('slugify', () => {
  bench('simple string', () => {
    slugify('Hello World')
  })
  bench('string with accents', () => {
    slugify('Héllo Wörld café résumé')
  })
  bench('string with special chars', () => {
    slugify('Hello! @World# $How% ^Are& *You?')
  })
  bench('already slugified', () => {
    slugify('hello-world')
  })
  bench('long string', () => {
    slugify('This is a very long string that should be converted to a URL friendly slug format')
  })
})
