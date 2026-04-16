/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isNull } from './isNull';
import { isNullish } from './isNullish';
import { isDefined } from './isDefined';

describe('isNull — property-based', () => {
  it('isNull(v) → isNullish(v)', () => {
    expect(isNull(null)).toBe(true);
    expect(isNullish(null)).toBe(true);
  });

  it('isNull(v) → !isDefined(v)', () => {
    expect(isNull(null)).toBe(true);
    expect(isDefined(null)).toBe(false);
  });

  it('non-null primitives are never null', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(undefined)),
        (v) => {
          expect(isNull(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isNull — contract', () => {
  it('null → true', () => expect(isNull(null)).toBe(true));
  it('undefined → false', () => expect(isNull(undefined)).toBe(false));
  it('0 → false', () => expect(isNull(0)).toBe(false));
  it("'' → false", () => expect(isNull('')).toBe(false));
  it('false → false', () => expect(isNull(false)).toBe(false));
  it('{} → false', () => expect(isNull({})).toBe(false));
});
