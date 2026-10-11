/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stringifySequence } from '../json/stringifySequence';
import { isJsonSequence } from './isJsonSequence';

describe('isJsonSequence — property-based', () => {
  it('is true for anything stringifySequence writes', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      expect(isJsonSequence(stringifySequence(values))).toBe(true);
    }));
  });

  it('never throws, for any input', () => {
    fc.assert(fc.property(fc.anything(), (value) => {
      expect(typeof isJsonSequence(value)).toBe('boolean');
    }));
  });
});
