/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isDefined } from './isDefined';
import { isNullish } from './isNullish';

describe('isDefined — property-based', () => {
  it('isDefined(v) === !isNullish(v)', () => {
    fc.assert(
      fc.property(fc.anything(), (v) => {
        expect(isDefined(v)).toBe(!isNullish(v));
      }),
    );
  });

  it('all primitives except null/undefined are defined', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.bigInt()),
        (v) => {
          expect(isDefined(v)).toBe(true);
        },
      ),
    );
  });
});

describe('isDefined — contract', () => {
  it('0 → true', () => expect(isDefined(0)).toBe(true));
  it('false → true', () => expect(isDefined(false)).toBe(true));
  it("'' → true", () => expect(isDefined('')).toBe(true));
  it('[] → true', () => expect(isDefined([])).toBe(true));
  it('{} → true', () => expect(isDefined({})).toBe(true));
  it('NaN → true', () => expect(isDefined(NaN)).toBe(true));
  it('null → false', () => expect(isDefined(null)).toBe(false));
  it('undefined → false', () => expect(isDefined(undefined)).toBe(false));
});
