/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { isValid } from './isValid'

describe('isValid', () => {
  bench('valid semver', () => {
    isValid('1.2.3')
  })
  bench('semver with prerelease and build', () => {
    isValid('1.0.0-beta.2+exp.sha.5114f85')
  })
  bench('invalid', () => {
    isValid('garbage')
  })
  bench('debian', () => {
    isValid('1:2.30~rc1-3ubuntu2', 'debian')
  })
})
