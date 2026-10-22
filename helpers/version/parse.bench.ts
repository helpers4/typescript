/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { parse } from './parse'

describe('parse', () => {
  bench('core version only', () => {
    parse('1.2.3')
  })
  bench('with prerelease and build metadata', () => {
    parse('1.0.0-beta.1+exp.sha.5114f85')
  })
  bench('with leading v', () => {
    parse('v2.0.0-alpha.1')
  })
})
