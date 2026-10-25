/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { sortVersions } from './sortVersions'

const versions = Array.from({ length: 200 }, (_, i) => `${i % 7}.${(i * 13) % 50}.${(i * 31) % 20}`)

describe('sortVersions', () => {
  bench('200 semver versions, ascending', () => {
    sortVersions(versions)
  })
  bench('200 semver versions, descending', () => {
    sortVersions(versions, { order: 'desc' })
  })
})
