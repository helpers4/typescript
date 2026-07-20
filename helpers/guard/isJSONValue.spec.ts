/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isJSONValue } from './isJSONValue';

describe('isJSONValue — property-based', () => {
  it('any value produced by fc.jsonValue() is valid', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        expect(isJSONValue(value)).toBe(true);
      }),
    );
  });

  it('surviving a JSON.stringify/parse round-trip unchanged implies validity', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        const roundTripped: unknown = JSON.parse(JSON.stringify(value));
        expect(isJSONValue(roundTripped)).toBe(true);
      }),
    );
  });
});

describe('isJSONValue — contract', () => {
  it('undefined is never a JSON value', () => {
    expect(isJSONValue(undefined)).toBe(false);
  });

  it('a Date instance is never a JSON value, even though it stringifies', () => {
    expect(isJSONValue(new Date())).toBe(false);
  });
});
