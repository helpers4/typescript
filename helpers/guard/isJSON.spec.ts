/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isJSON } from './isJSON';

describe('isJSON — property-based', () => {
  it('JSON.stringify output is always valid JSON text', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        expect(isJSON(JSON.stringify(value))).toBe(true);
      }),
    );
  });

  it('non-string values are always false', () => {
    fc.assert(
      fc.property(fc.anything().filter((v) => typeof v !== 'string'), (value) => {
        expect(isJSON(value)).toBe(false);
      }),
    );
  });
});

describe('isJSON — contract', () => {
  it('empty string is not valid JSON', () => {
    expect(isJSON('')).toBe(false);
  });
});
