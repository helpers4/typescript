/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { injectWordBreaks } from './injectWordBreaks'

describe('injectWordBreaks', () => {
  bench('camelCase identifier', () => {
    injectWordBreaks('getUserProfileData')
  })

  bench('file path', () => {
    injectWordBreaks('path/to/my_file')
  })

  bench('atomic numeric value', () => {
    injectWordBreaks('-0.1%')
  })

  bench('scientific notation with surrounding text', () => {
    injectWordBreaks('Δ=-2.4E+6,avg')
  })

  bench('D0 protected URL', () => {
    injectWordBreaks('https://example.com/foo/bar')
  })

  bench('long comma-separated list (stress)', () => {
    injectWordBreaks('alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa')
  })

  bench('long camelCase identifier (stress)', () => {
    injectWordBreaks('getUserProfileDataWithExtendedMetadataAndContext')
  })
})
