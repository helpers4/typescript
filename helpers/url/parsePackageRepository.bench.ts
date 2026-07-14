/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { parsePackageRepository } from './parsePackageRepository'

describe('parsePackageRepository', () => {
  bench('shorthand string', () => {
    parsePackageRepository('github:helpers4/typescript')
  })
  bench('object form with git+https URL', () => {
    parsePackageRepository({ type: 'git', url: 'git+https://github.com/helpers4/typescript.git' })
  })
})
