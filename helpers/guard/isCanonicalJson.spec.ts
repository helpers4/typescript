/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stringify } from '../json/stringify';
import { isCanonicalJson } from './isCanonicalJson';

describe('isCanonicalJson — property-based', () => {
  it('is true for anything stringify writes in canonical mode', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      expect(isCanonicalJson(stringify(value, 'canonical'))).toBe(true);
    }));
  });

  it('is false for indented output of any non-empty object', () => {
    fc.assert(fc.property(fc.dictionary(fc.string(), fc.jsonValue(), { minKeys: 1 }), (object) => {
      expect(isCanonicalJson(stringify(object))).toBe(false);
    }));
  });
});
