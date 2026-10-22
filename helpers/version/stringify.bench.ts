/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { stringify } from './stringify'

describe('stringify', () => {
  bench('core version only', () => {
    stringify({ scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] })
  })
  bench('with prerelease and build metadata', () => {
    stringify({
      scheme: 'semver',
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: ['beta'],
      build: ['exp', 'sha', '5114f85'],
    })
  })
})
