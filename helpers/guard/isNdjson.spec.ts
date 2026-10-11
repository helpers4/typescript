/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stringifyLines } from '../json/stringifyLines';
import { isNdjson } from './isNdjson';

describe('isNdjson — property-based', () => {
  it('is true for anything stringifyLines writes', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      expect(isNdjson(stringifyLines(values))).toBe(true);
    }));
  });

  it('never throws, for any input', () => {
    fc.assert(fc.property(fc.anything(), (value) => {
      expect(typeof isNdjson(value)).toBe('boolean');
    }));
  });
});
