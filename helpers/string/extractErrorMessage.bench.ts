/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { extractErrorMessage } from './extractErrorMessage'

const errorInstance = new Error('Something went wrong')
const plainObject = { message: 'A plain object error' }
const unknownValue = { foo: 'bar' }

describe('extractErrorMessage', () => {
  bench('Error instance', () => {
    extractErrorMessage(errorInstance)
  })
  bench('plain object with message property', () => {
    extractErrorMessage(plainObject)
  })
  bench('unrecognized value, stringify: true', () => {
    extractErrorMessage(unknownValue, true)
  })
})
