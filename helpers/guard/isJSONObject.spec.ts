/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isJSONObject } from './isJSONObject';

describe('isJSONObject — property-based', () => {
  it('any dictionary of fc.jsonValue() is valid', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string(), fc.jsonValue()), (obj) => {
        expect(isJSONObject(obj)).toBe(true);
      }),
    );
  });
});

describe('isJSONObject — contract', () => {
  it('arrays are never JSON objects', () => {
    expect(isJSONObject([])).toBe(false);
  });

  it('empty object is valid', () => {
    expect(isJSONObject({})).toBe(true);
  });
});
