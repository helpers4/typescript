/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isTimestamp } from './isTimestamp';
import { isNumber } from './isNumber';

const MAX_TIMESTAMP_MS = 8640000000000000;
const MAX_UNIX_SECONDS = 7258118400;

describe('isTimestamp — property-based', () => {
  it('isTimestamp(v) → isNumber(v)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: MAX_UNIX_SECONDS }), (v) => {
        if (isTimestamp(v)) {
          expect(isNumber(v)).toBe(true);
        }
      }),
    );
  });

  it('non-number values are never timestamps', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (v) => {
          expect(isTimestamp(v)).toBe(false);
        },
      ),
    );
  });
});

describe('isTimestamp — contract', () => {
  it('Date.now() → true', () => expect(isTimestamp(Date.now())).toBe(true));
  it('1700000000 (Unix seconds) → true', () => expect(isTimestamp(1700000000)).toBe(true));
  it('1700000000000 (JS ms) → true', () => expect(isTimestamp(1700000000000)).toBe(true));
  it('0 → true (valid Unix epoch)', () => expect(isTimestamp(0)).toBe(true));
  it('MAX_TIMESTAMP_MS → true', () => expect(isTimestamp(MAX_TIMESTAMP_MS)).toBe(true));
  it('MAX_TIMESTAMP_MS + 1 → false', () => expect(isTimestamp(MAX_TIMESTAMP_MS + 1)).toBe(false));
  it('NaN → false', () => expect(isTimestamp(NaN)).toBe(false));
  it('Infinity → false', () => expect(isTimestamp(Infinity)).toBe(false));
  it('-Infinity → false', () => expect(isTimestamp(-Infinity)).toBe(false));
  it("'1609459200' → false (not a number)", () => expect(isTimestamp('1609459200')).toBe(false));
  it('negative timestamp treated as seconds/ms heuristic → true for reasonable negatives', () => {
    // -1 treated as seconds: abs=1 <= MAX_UNIX_SECONDS, 1000 <= MAX_TIMESTAMP_MS → true
    expect(isTimestamp(-1)).toBe(true);
  });
});
