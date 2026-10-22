/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeParseStrict } from './safeParseStrict';

describe('safeParseStrict — property-based', () => {
  it('never throws, and returns the fallback exactly when JSON.parse would throw', () => {
    const FAILED = Symbol('failed');
    fc.assert(fc.property(fc.string(), (text) => {
      let expected: unknown = FAILED;
      try {
        expected = JSON.parse(text);
      } catch {
        // keep FAILED
      }
      expect(safeParseStrict(text, FAILED)).toEqual(expected);
    }));
  });
});
